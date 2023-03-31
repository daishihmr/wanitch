const path = require('path');
const fs = require('fs');

const config = {
  clientId: 'u3imrmvy8a31k1myfgdoztwqmn0jha'
};
const configStr = fs.readFileSync('./config.ini', 'utf-8');
configStr.split('\n').forEach((line) => {
  if (!line) return;
  const kv = line.split('=').map(_ => _.trim());
  config[kv[0]] = kv[1];
});

module.exports = {
  config,
};
