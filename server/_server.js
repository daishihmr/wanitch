const http = require('http')
const fs = require('fs')
const mime = require('mime-types')
const WebSocketServer = require('websocket').server
const WebSocket = require('websocket').client

const api = require('./api')
const { getUser } = require('./getUser')

const setup = async () => {
  const me = await getUser(process.env.CHANNEL_NAME)
  const myId = me.data[0].id
  
  const webServer = await setupWebServer()
  const websocketServer = await setupWebsocketServer(webServer, myId);
  await setupEventSub(websocketServer, myId)
}

const setupWebServer = () => new Promise((resolve) => {
  const server = http.createServer((req, res) => {
    const url = decodeURI(req.url === '/' ? '/index.html' : req.url)
    switch (url) {
      default:
        fs.readFile('./web' + url, (err, data) => {
          if (err) {
            res.writeHead(404)
          } else {
            res.writeHead(200, {
              'Content-Type': mime.lookup(url),
            })
            res.write(data)
          }
          res.end()
        })
    }
  })
  server.listen((process.env.PORT || '3000'), () => {
    console.log('[INFO] listen ' + (process.env.PORT || '3000'))
    console.log('[INFO] open http://localhost:' + (process.env.PORT || '3000'))
    resolve(server)
  })
})

const setupWebsocketServer = (webServer, myId) => new Promise((resolve) => {
  const websocketServer = {
    // conn: null,
    connections: [],
  }
  websocketServer.broadcast = (message) => {
    const json = JSON.stringify(message)
    websocketServer.connections.forEach((conn) => {
      try {
        conn.sendUTF(json)
      } catch (e) {
        console.error(e)
      }
    })
  }

  const wsServer = new WebSocketServer({
    httpServer: webServer,
    autoAcceptConnections: false,
  })

  wsServer.on('request', (req) => {
    const conn = req.accept('ws-local', req.origin)
    websocketServer.connections.push(conn)
    console.log('[INFO] accepted')
    conn.on('message', async (message) => {
      console.log('conn on message', message)
      const json = JSON.parse(message.utf8Data)
      if (json.command == 'postchat') {
        await api.post(`https://api.twitch.tv/helix/chat/messages`, JSON.stringify({
          broadcaster_id: myId,
          sender_id: myId,
          message: json.data.text,
        }))
      }
    })
    conn.on('close', () => {
      const idx = websocketServer.connections.indexOf(conn)
      websocketServer.connections.splice(idx, 1)
      console.log('[INFO] closed')
    })
  })

  resolve(websocketServer)
})

const setupEventSub = (websocketServer, myId) => new Promise((resolve) => {
  const ws = new WebSocket()
  ws.on('connect', (connection) => {
    console.log('[INFO] EventSub connected')
    connection.on('message', async (e) => {
      const msg = JSON.parse(e.utf8Data)
      if (msg.metadata.message_type != 'session_keepalive') {
        console.log('[INFO] EventSub message', msg)
      }

      if (msg.metadata.message_type == 'session_welcome') {
        const condition = {
          broadcaster_user_id: myId,
          moderator_user_id: myId,
          user_id: myId,
        }
        const transport = {
          method: 'websocket',
          session_id: msg.payload.session.id,
        }
      
        console.log('[INFO] EventSub request read chat')
        await api.post('https://api.twitch.tv/helix/eventsub/subscriptions', JSON.stringify({
          type: 'channel.chat.message',
          version: '1',
          condition,
          transport,
        }))

        console.log('[INFO] EventSub request follow')
        await api.post('https://api.twitch.tv/helix/eventsub/subscriptions', JSON.stringify({
          type: 'channel.follow',
          version: '2',
          condition,
          transport,
        }))

        console.log('[INFO] EventSub request subscribe')
        await api.post('https://api.twitch.tv/helix/eventsub/subscriptions', JSON.stringify({
          type: 'channel.subscribe',
          version: '1',
          condition,
          transport,
        }))

        console.log('[INFO] EventSub request bits use')
        await api.post('https://api.twitch.tv/helix/eventsub/subscriptions', JSON.stringify({
          type: 'channel.bits.use',
          version: '1',
          condition,
          transport,
        }))

        console.log('[INFO] EventSub request channel points')
        await api.post('https://api.twitch.tv/helix/eventsub/subscriptions', JSON.stringify({
          type: 'channel.channel_points_custom_reward_redemption.add',
          version: '1',
          condition,
          transport,
        }))

        console.log('[INFO] EventSub request raid')
        await api.post('https://api.twitch.tv/helix/eventsub/subscriptions', JSON.stringify({
          type: 'channel.chat.notification',
          version: '1',
          condition,
          transport,
        }))

        resolve()

      } else if (msg.metadata.message_type == 'notification') {
        if (msg.payload.subscription.type == 'channel.chat.message') { // チャットが来た
          const event = msg.payload.event
          const user = await getUser(event.chatter_user_login)
          websocketServer.broadcast({
            topic: 'chat',
            message: { event, user: user.data[0] },
          })
        } else if (msg.payload.subscription.type == 'channel.follow') { // フォロー
          const event = msg.payload.event
          const user = await getUser(event.user_login)
          websocketServer.broadcast({
            topic: 'follow',
            message: { event, user: user.data[0] },
          })
        } else if (msg.payload.subscription.type == 'channel.subscribe') { // サブスク
          const event = msg.payload.event
          const user = await getUser(event.user_login)
          websocketServer.broadcast({
            topic: 'subscribe',
            message: { event, user: user.data[0] },
          })
        } else if (msg.payload.subscription.type == 'channel.bits.use') { // ビッツ
          const event = msg.payload.event
          const user = await getUser(event.user_login)
          websocketServer.broadcast({
            topic: 'bits',
            message: { event, user: user.data[0] },
          })
        } else if (msg.payload.subscription.type == 'channel.channel_points_custom_reward_redemption.add') { // チャネポ
          const event = msg.payload.event
          const user = await getUser(event.user_login)
          websocketServer.broadcast({
            topic: 'channel-points',
            message: { event, user: user.data[0] },
          })
        } else if (msg.payload.subscription.type == 'channel.chat.notification') { // 通知
          const event = msg.payload.event
          if (event.raid) { // レイド
            const user = await getUser(event.raid.user_login)
            websocketServer.broadcast({
              topic: 'raid',
              message: { event, user: user.data[0] },
            })
          }
        }
      }
    })
  })
  ws.connect('wss://eventsub.wss.twitch.tv/ws')
})

module.exports = setup
