const config = require('./config').config;

const get = async (url) => {
  console.log('GET ' + url)
  const res = await fetch(url, {
    headers: {
      "Client-Id": config.clientId,
      "Authorization": `Bearer ${config.oauth}`,
    }
  })
  return await res.json()
}

const post = async (url, params) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Client-Id": config.clientId,
      "Authorization": `Bearer ${config.oauth}`,
      "Content-Type": "application/json",
    },
    body: params,
  });
  return await res.json();
}

const getUser = async (userName) => {
  console.log("get user")
  const result = await get(
    "https://api.twitch.tv/helix/users" + 
    `?login=${userName}`
  )
  return result.data[0]
}

const getChannelInformation = async (userId) => {
  console.log("get channel information")
  const result = await (get(
    `https://api.twitch.tv/helix/channels` +
    `?broadcaster_id=${ userId }`
  ))
  return result.data[0]
}

module.exports = {
  get,
  post,
  getUser,
  getChannelInformation,
}
