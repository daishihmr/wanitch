import { audioContext, gainNode } from '../utils/webaudio.js'

export const VideoPlayer = {
  data: () => ({
    playing: false,
    src: null,
    queue: [],
  }),
  mounted () {
    this.checkQueue()
  },
  methods: {
    enqueue (params = {
      video,
      sound,
      volume,
      x,
      y,
      width,
      height,
      onstart,
      transform,
    }) {
      console.log('enqueue', params)
      this.queue.push(params)
    },
    async start ({
      video,
      sound,
      volume,
      x,
      y,
      width,
      height,
      onstart,
      transform,
    }) {
      console.log('start', video, sound, this.$refs.video)
      return new Promise(async (resolve) => {
        const v = this.$refs.video
        if (video) {
          v.style.position = 'absolute'
          v.style.left = `${ x || 0 }px`
          v.style.top = `${ y || 0 }px`
          v.width = width || 1280
          v.height = height || 720
          v.style.transform = transform || ''
          v.volume = volume || 1.0
          this.playing = true

          const _onplay = () => {
            if (onstart) onstart()
            v.removeEventListener('play', _onplay)
          }
          v.addEventListener('play', _onplay)

          const onended = () => {
            v.removeEventListener('ended', onended)
            this.playing = false
            resolve()
          }
          v.addEventListener('ended', onended)

          v.src = video
          v.play()
        }

        if (sound) {
          const buf = await (await fetch(sound)).arrayBuffer()
          audioContext.decodeAudioData(buf, (audioBuffer) => {
            gainNode.gain.value = volume || 1.0

            const srcNode = audioContext.createBufferSource()
            srcNode.buffer = audioBuffer
            srcNode.connect(gainNode)
            srcNode.start(0)
            if (!video && onstart) {
              onstart()
            }
            srcNode.onended = () => {
              srcNode.disconnect(gainNode)
              srcNode.stop(0)
              if (!video) resolve()
            }
          })
        }
      })
    },
    async checkQueue () {
      let params = this.queue.shift()
      while (params) {
        await this.start(params)
        params = this.queue.shift()
      }
      setTimeout(() => {
        this.checkQueue()
      }, 1000)
    },
  },
  template: `
  <video ref="video" v-show="playing" class="video-player" :src="src">
  </video>
  `
}
