export default {
  async postchat (text) {
    const res = await fetch('/postchat', {
      method: 'POST',
      body: JSON.stringify({
        text
      }),
    })
    return await res.json()
  },

  async getchatters () {
    const res = await fetch('/getchatters')
    return await res.json()
  },

  async createclip () {
    const res = await fetch('/createclip', {
      method: 'POST',
    })
    return await res.json()
  },

  async getclips (login) {
    const res = await fetch(`/getclips?login=${encodeURIComponent(login)}`)
    return await res.json()
  },

  async getfiles (dir) {
    const res = await fetch(`/getfiles?dir=${encodeURIComponent(dir)}`)
    return await res.json()
  },

  async askAI (question) {
    const res = await fetch(`/askai?question=${question}`)
    const { answer } = await res.json()
    this.postchat(answer)
  },
}
