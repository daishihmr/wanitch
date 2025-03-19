const api = require('./api')
const fs = require('fs')
const path = require('path')
const { getUser } = require('./getUser')

const Service = {
  myId: null,

  async postchat ({ text }) {
    try {
      const res = await api.post(`https://api.twitch.tv/helix/chat/messages`, JSON.stringify({
        broadcaster_id: this.myId,
        sender_id: this.myId,
        message: text,
      }))
      return await res.json()
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
      return await res.json()
    } catch (e) {
      return { error: e.message }
    }
  },

  async createclip () {
    try {
      const res = await api.post(`https://api.twitch.tv/helix/clips`, JSON.stringify({
        broadcaster_id: this.myId,
      }))
      return await res.json()
    } catch (e) {
      return { error: e.message }
    }
  },

  async getclips ({ broadcaster_id, is_featured }) {
    const data = []
    const nextPage = async (after) => {
      const res = await api.get(`https://api.twitch.tv/helix/clips` +
        `?broadcaster_id=${broadcaster_id}` +
        `&is_featured=${is_featured}` +
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
}  

module.exports = Service
