const api = require('./api')

const cache = {}

const getUser = async (login) => {
  if (cache[login]) {
    return cache[login]
  }
  const user = await api.get(`https://api.twitch.tv/helix/users?login=${login}`)
  cache[login] = user
  return user
}

module.exports = {
  getUser,
}
