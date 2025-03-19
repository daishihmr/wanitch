const fetch = require('node-fetch')

const get = async (url) => {
  console.log('get', url)
  const res = await fetch(url, {
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`,
    }
  })
  const json = await res.json()
  // console.log(json)
  if (json.error) {
    throw new Error(e.error)
  }
  return json
}

const post = async (url, params) => {
  console.log('post', url)
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
  // console.log(json)
  if (json.error) {
    throw new Error(e.error)
  }
  return json
}

module.exports = {
  get,
  post,
}
