import { ref } from 'vue'

export default {
  props: ['embed_url'],
  computed: {
    url () {
      return `${this.embed_url}&parent=localhost&autoplay=true&muted=false`
    },
  },
  setup () {
    return {
      
    }
  },
  template: `
  <iframe v-if="embed_url" :src="url" />
  `
}
