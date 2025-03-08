const fetch = require('node-fetch')

const get = async (url) => {
  const res = await fetch(url, {
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`,
    }
  })
  return await res.json()
}

const post = async (url, params) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: params,
  })
  const json = await res.json()
  console.log(json)
  if (json.error) {
    throw new Error(json.error)
  }
  return json
}

module.exports = {
  get,
  post,
}
