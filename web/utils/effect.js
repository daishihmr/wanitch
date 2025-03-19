import service from './service.js'

export default {
  videoPlayer: null,
  twitchClip: null,
  comments: null,
  wanis: null,
  emotes: null,

  async help () {
    await service.postchat('- ' + [
      '!help',
      '!wani',
      '!trustme',
      '!hero',
      '!asu',
      '!nani',
      '!dame',
      '!okaeri',
      '!shoot',
      '!short',
      '!kurukuru',
    ].join(', '))
  },
  async trustme () {
    const files = await service.getfiles('./resources/trustme')
    if (files.data.length) {
      this.videoPlayer.enqueue({
        video: './resources/trustme/' + files.data.random(),
        transform: 'perspective(800px) rotateY(-20deg)',
        x: 1300,
        y: 100,
        width: 720 * 0.6,
        height: 1280 * 0.6,
        volume: 0.7,
      })
    }
  },
  async short () {
    const files = await service.getfiles('./resources/short')
    if (files.data.length) {
      this.videoPlayer.enqueue({
        video: './resources/short/' + files.data.random(),
        transform: 'perspective(800px) rotateY(-20deg)',
        x: 1300,
        y: 100,
        width: 720 * 0.6,
        height: 1280 * 0.6,
        volume: 0.3,
      })
    }
  },
  async okaeri () {
    const files = await service.getfiles('./resources/okaeri')
    if (files.data.length) {
      this.videoPlayer.enqueue({
        sound: './resources/okaeri/' + files.data.random(),
      })
    }
  },
  playShort (video) {
    this.videoPlayer.enqueue({
      video,
      transform: 'perspective(800px) rotateY(-20deg)',
      x: 1300,
      y: 100,
      width: 720 * 0.6,
      height: 1280 * 0.6,
      volume: 0.3,
    })
  },
  playSmallVideo (video) {
    this.videoPlayer.enqueue({
      video,
      transform: 'perspective(800px) rotateY(-20deg)',
      x: 1000,
      y: 200,
      width: 1280 * 0.6,
      height: 720 * 0.6,
      volume: 0.3,
    })
  },
  playFullscreenVideo (video, sound) {
    this.videoPlayer.enqueue({
      video,
      sound,
      transform: '',
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
      volume: 0.8,
    })
  },
  dame () {
    this.videoPlayer.enqueue({
      video: './resources/だめだね.mov',
      transform: 'perspective(800px) rotateY(-20deg)',
      x: 1000,
      y: 200,
      width: 1280 * 0.6,
      height: 720 * 0.6,
      volume: 0.3,
    })
  },
  playVideo (params) {
    this.videoPlayer.enqueue(params)
  },
  playSound (sound) {
    this.videoPlayer.enqueue({
      sound,
    })
  },
  wani () {
    this.videoPlayer.enqueue({
      sound: './resources/ありゃワニだ.mp3',
      onstart: () => this.wanis.add(),
    })
  },
  async playClip (login) {
    await this.twitchClip.start(login)
  },
  emote (event) {
    const es = event.message.fragments.filter(_ => _.type == 'emote').map(_ => _.emote)
    es.forEach(e => this.emotes.add(e))
  },
  showComment (event) {
    this.playSound('./resources/pixta_65456670.mp3')
    this.comments.addMessage(event)
  },
}
