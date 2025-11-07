import service from '../utils/service.js'

export const TwitchClip = {
  data: () => ({
    playing: false,
    src: null,
    clip: null,
  }),
  methods: {
    async start (login) {
      const res = await service.getclips(login)
      const features = res.data.filter(_ => _.is_featured)

      let clip = null
      if (features.length >= 3) {
        clip = features[Math.floor(Math.random() * features.length)]
      } else {
        clip = res.data[Math.floor(Math.random() * res.data.length)]
      }

      console.log('clip', clip)
      this.playing = true
      this.src = `${clip.embed_url}&parent=localhost&autoplay=true`
      this.clip = clip

      return new Promise((resolve) => {
        setTimeout(() => {
          this.playing = false
          this.src = ''
          resolve()
        }, clip.duration * 1000 + 1000)
      })
    },
  },
  template: `
  <div v-if="playing" class="twitch-clip-container">
    <h3 class="twitch-clip-title">{{ clip.title }}<span> clipped by {{ clip.creator_name }}</span></h3>
    <iframe class="twitch-clip" :src="src" />
  </div>
  `
}
