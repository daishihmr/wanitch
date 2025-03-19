const api = require('./api')

const cache = {}

const getUser = async (login) => {
  console.log('getUser', login)
  if (cache[login]) {
    return cache[login]
  }
  const users = await api.get(`https://api.twitch.tv/helix/users?login=${login}`)
  const user = users.data[0] 
  console.log('user', user)
  if (user) {
    cache[login] = user
  }
  return user
}

const getUserById = async (id) => {
  const users = await api.get(`https://api.twitch.tv/helix/users?id=${id}`)
  const user = users.data[0] 
  console.log('user', user)
  if (user) {
    cache[user.login] = user
  }
  return user
}

module.exports = {
  getUser,
  getUserById,
}
