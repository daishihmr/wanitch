const server = require('./server');
const config = require('./config').config;
const api = require('./api');

console.log(config);
server.setup();
