const api = require('./api')
const fs = require('fs')
const path = require('path')
const { getUser } = require('./getUser')
const OpenAI = require("openai")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const Service = {
  myId: null,

  async postchat ({ text }) {
    try {
      const res = await api.post(`https://api.twitch.tv/helix/chat/messages`, JSON.stringify({
        broadcaster_id: this.myId,
        sender_id: this.myId,
        message: text,
      }))
      return await res
    } catch (e) {
      return { error: e.message }
    }
  },

  async getchatters () {
    try {
      const res = await api.get(
        `https://api.twitch.tv/helix/chat/chatters` +
        `?broadcaster_id=${this.myId}` +
        `&moderator_id=${this.myId}`
      )
      return await res
    } catch (e) {
      return { error: e.message }
    }
  },

  async createclip () {
    try {
      const res = await api.post(`https://api.twitch.tv/helix/clips`, JSON.stringify({
        broadcaster_id: this.myId,
      }))
      return await res
    } catch (e) {
      return { error: e.message }
    }
  },

  async getclips ({ broadcaster_id }) {
    const data = []
    const nextPage = async (after) => {
      const res = await api.get(`https://api.twitch.tv/helix/clips` +
        `?broadcaster_id=${broadcaster_id}` +
        (after ? `&after=${after}` : '')
      )

      if (res.data.length && res.pagination.cursor) {
        data.push(...res.data)
        if (data.length < 50) {
          await nextPage(res.pagination.cursor)
        }
      }
    }

    try {
      await nextPage()
      return { data }
    } catch (e) {
      return { error: e.message }
    }
  },

  getfiles ({ dir }) {
    const files = fs.readdirSync(path.join('./web', dir))
    return { data: files }
  },

  async shoutout ({ to_broadcaster_id }) {
    await api.post('https://api.twitch.tv/helix/chat/shoutouts', {
      from_broadcaster_id: this.myId,
      to_broadcaster_id,
      moderator_id: this.myId,
    })
  },

  async askai ({ question }) {
    try {
      const result = await openai.responses.create({
        model: "gpt-5-nano",
        input: question,
        store: true,
      })
      console.log('result', result)
      return result.output_text
    } catch (e) {
      return ''
    }
  },
}

module.exports = Service
