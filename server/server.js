const http = require('http');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types')
const tmi = require('tmi.js')
const WebSocketServer = require('websocket').server
const WebSocket = require('websocket').client

const config = require('./config').config;
const api = require('./api');
const { EventDispatcher } = require('./event');

const e = new EventDispatcher();

const setup = async () => {
  const webServer = await setupWebServer();
  const webSocketServer = await setupWebSocketServer(webServer);
  const tmiClient = await setupTmiClient();
  const channelId = await getChannelId();
  const pubsubClient = await setupPubSub(channelId);

  return {
    webServer,
    webSocketServer,
    tmiClient,
    channelId,
    pubsubClient,
  };
};

const setupWebServer = () => {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURI(req.url === '/' ? '/index.html' : req.url);
      console.log('GET ' + url);
      switch (url) {
        default:
          fs.readFile(path.join(__dirname, '../client', url), (err, data) => {
            if (err) {
              res.writeHead(404);
            } else {
              res.writeHead(200, {
                'Content-Type': mime.lookup(url),
              });
              res.write(data);
            }
            res.end();
          });
      }
    });
    server.listen(config.port, () => {
      resolve(server);
      console.log('[INFO] webserver LISTEN ' + config.port);
    });
  });
};

const setupWebSocketServer = (server) => {
  return new Promise((resolve) => {
    const result = new EventDispatcher();
    result.connections = [];
    result.broadcast = (message) => {
      result.connections.forEach((conn) => {
        try {
          conn.sendUTF(JSON.stringify(message));
        } catch (e) {
          console.error(e);
        }
      });
    };
    
    const wsServer = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false,
    });
    console.log('[INFO] websocket ready')
    
    wsServer.on('request', (req) => {
      const conn = req.accept('ws-local', req.origin);
      result.connections.push(conn);
      console.log('[INFO] websocket accepted')
      conn.on('close', () => {
        const idx = result.connections.indexOf(conn);
        result.connections.splice(idx, 1);
        console.log('[INFO] closed');
      });
    });
    
    resolve(result);
  });
};

const setupTmiClient = () => {
  return new Promise((resolve) => {
    const tmiClient = new tmi.Client({
      options: {
        debug: true,
      },
      identity: {
        username: config.username,
        password: 'oauth:' + config.oauth,
      },
      channels: [config.channel],
    });

    tmiClient.connect().catch((e) => {
      console.error(e)
    }).then(() => {
      console.log('[INFO] tmi connected')
      resolve(tmiClient);
    });
  });
};

const getChannelId = async () => {
  const channelUser = await api.getUser(config.channel);
  return channelUser.id;
};

const setupPubSub = (channelId) => {
  return new Promise((resolve) => {
    const result = new EventDispatcher();

    const ws = new WebSocket()
    ws.on('connect', (connection) => {
      console.log('[INFO] pubsub connected')
    
      const heartbeatHandle = setInterval(() => {
        console.log('[INFO] pubsub PING')
        connection.sendUTF(JSON.stringify({ type: 'PING' }))
      }, 60 * 1000)
    
      connection.on('message', (e) => {
        const msg = JSON.parse(e.utf8Data)
        console.log('[INFO] pubsub message', msg)
        if (msg.type === 'RESPONSE') {
          resolve();
        }
        if (msg.data) {
          if (msg.data.topic) {
            if (msg.data.topic.indexOf('channel-points') >= 0) {
              channelPoint.process(msg)
            }
          }
          result.fire('message', msg.data);
        }
      })
    
      connection.on('close', () => {
        console.log('[INFO] pubsub closed')
        clearInterval(heartbeatHandle)
    
        setTimeout(() => {
          ws.connect('wss://pubsub-edge.twitch.tv')
        }, 1 * 1000)
      })
    
      connection.on('error', (e) => {
        console.log('[ERROR] pubsub', e)
      })
    
      console.log('[INFO] pubsub LISTEN')
      connection.sendUTF(JSON.stringify({
        type: 'LISTEN',
        data: {
          topics: [
            `channel-bits-events-v1.${ channelId }`,
            `channel-subscribe-events-v1.${ channelId }`,
            `channel-points-channel-v1.${ channelId }`,
          ],
          auth_token: config.oauth
        }
      }))
    })
    ws.connect('wss://pubsub-edge.twitch.tv')
  });
};

module.exports = {
  setup,
};
