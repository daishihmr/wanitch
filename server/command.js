const api = require('./api')

const Command = {
  myId: null,

  async process (cmd, data) {
    switch (cmd) {
      case 'postchat':
        await api.post(`https://api.twitch.tv/helix/chat/messages`, JSON.stringify({
          broadcaster_id: this.myId,
          sender_id: this.myId,
          message: data.text,
        }))
        break
    }
  }
}

module.exports = Command
