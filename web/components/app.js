import { ref } from 'vue'
import TwitchClip from './twitch-clip.js'

export default {
  components: {
    TwitchClip,
  },
  setup () {
    return {
    }
  },
  template: `
  <div class="app">
    <TwitchClip :embed_url="message" />
  </div>
  `
}
