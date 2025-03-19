import animejs from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/+esm'

export const Emote = {
  props: ['emote'],
  data: () => ({}),
  computed: {
    src () {
      if (!this.emote) return null
      const id = this.emote.id
      const format = this.emote.format.includes('animated') ? 'animated' : 'static'
      return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/${format}/light/2.0`
    },
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      const r = Math.floor(Math.random() * 2)
      switch (r) {
        case 0: return this.pattern0()
        case 1: return this.pattern1()
        case 2: return this.pattern2()
        case 3: return this.pattern3()
        case 4: return this.pattern4()
      }
    },
    pattern0 () {
      const e = this.$refs.emote
      animejs.set(e, {
        left: `${1000 + Math.random() * 500}px`,
        top: `${-200}px`,
        width: `${200}px`,
        height: `${200}px`,
      })

      const delay = Math.random() * 1000

      // x axis
      const tlX = animejs.timeline({
        targets: e,
      })
      tlX.add({
        left: `${50}px`,
        rotate: '-90deg',
        easing: 'linear',
        delay,
        duration: 500,
      })
      tlX.add({
        left: `${500 + Math.random() * 500}px`,
        rotate: '1080deg',
        easing: 'easeOutQuad',
        duration: 1000,
      })
      tlX.add({
        left: `${-200}px`,
        easing: 'easeInQuad',
        rotate: `${-180}deg`,
        duration: 1000,
      }, '+=1000')
      tlX.add({
        complete: () => this.$emit('ended')
      }, '+=1000')

      // y axis
      const tlY = animejs.timeline({
        targets: e,
      })
      tlY.add({
        top: `${1080 - 400}px`,
        easing: 'easeInQuad',
        delay,
        duration: 500,
      })
      tlY.add({
        top: `${1080 - 600}px`,
        easing: 'easeOutQuad',
        duration: 1000,
      })
    },
    pattern1 () {
      const e = this.$refs.emote
      animejs.set(e, {
        left: `${1920 * (0.1 + Math.random() * 0.8)}px`,
        top: `${1080}px`,
        width: `${200}px`,
        height: `${200}px`,
      })

      const delay = Math.random() * 1000

      const tl = animejs.timeline({
        targets: e,
      })
      tl.add({
        top: `${1080 * (0.2 + Math.random() * 0.3)}px`,
        easing: 'easeOutQuad',
        rotate: `${360 * 5}deg`,
        duration: 1000,
        delay,
      })
      tl.add({
        left: `${-200}px`,
        easing: 'easeInQuad',
        rotate: `${-180}deg`,
        duration: 1000,
      }, '+=1000')
      tl.add({
        complete: () => this.$emit('ended')
      }, '+=1000')
    },
    pattern2 () {},
    pattern3 () {},
    pattern4 () {},
  },
  template: `
    <img ref="emote" class="emote-image" :src="src" />
  `
}

export const Emotes = {
  components: {
    Emote,
  },
  data: () => ({
    emotes: [],
  }),
  methods: {
    add (emote) {
      this.emotes.push(emote)
    },
    onended (emote) {
      this.emotes = this.emotes.filter(_ => _.id != emote.id)
    },
  },
  template: `
  <div class="emotes">
    <Emote v-for="(emote, index) in emotes" :key="emote.id" :emote="emote" @ended="onended(emote)" />
  </div>
  `
}

// {
//   "id": "emotesv2_cd30dbf0d31a4a0694da792084d60922",
//   "emote_set_id": "458689797",
//   "owner_id": "179777714",
//   "format": [
//       "static",
//       "animated"
//   ]
// }
