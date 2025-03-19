import animejs from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/+esm'

export const Comment = {
  props: ['event'],
  data: () => ({
    ended: false,
  }),
  mounted () {
    setTimeout(() => {
      this.startAnimation()
    }, 100)
  },
  methods: {
    getStyle () {
      return {
        color: this.event.color || 'black',
        left: '1920px',
      }
    },
    getUrl (emote) {
      const id = emote.id
      const format = emote.format.includes('animated') ? 'animated' : 'static'
      return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/${format}/light/2.0`
    },
    startAnimation () {
      const comment = this.$refs.comment
      const rect = comment.getBoundingClientRect()
      const width = Math.floor(rect.width)
      const height = Math.floor(rect.height)
      comment.style.top = `${Math.random() * (1080 - height)}px`

      animejs({
        targets: comment,
        left: `${-width}px`,
        duration: 9000,
        easing: 'linear',
        complete: () => {
          this.ended = true
          this.$emit('ended')
        }
      })
    },
  },
  template: `
  <div ref="comment" class="comment" :style="getStyle()">
    <template v-for="(fragment, index) in event.message.fragments" :key="index">
      <div v-if="fragment.type === 'text'">{{ fragment.text }}</div>
      <template v-else-if="fragment.type === 'emote'">
        <img :src="getUrl(fragment.emote)" class="comment-image" />
      </template>
    </template>
  </div>
  `
}

export const Comments = {
  components: {
    Comment,
  },
  data: () => ({
    events: [],
  }),
  methods: {
    addMessage (event) {
      this.events.push(event)
    },
    onended (event) {
      console.log('ended')
      this.events = this.events.filter(_ => _.message_id !== event.message_id)
    },
  },
  template: `
  <div>
    <Comment
      v-for="(event) in events"
      :key="event.message_id"
      :event="event"
      @ended="onended(event)"
    />
  </div>
  `
}

// {
//   "broadcaster_user_id": "179777714",
//   "broadcaster_user_login": "daishihmr",
//   "broadcaster_user_name": "だいし",
//   "source_broadcaster_user_id": null,
//   "source_broadcaster_user_login": null,
//   "source_broadcaster_user_name": null,
//   "chatter_user_id": "179777714",
//   "chatter_user_login": "daishihmr",
//   "chatter_user_name": "だいし",
//   "message_id": "80c1b1b1-3d6b-4158-9196-7d0c8e1cae00",
//   "source_message_id": null,
//   "message": {
//       "text": "123 PMSTwin 456 daishi7Anim4 789",
//       "fragments": [
//           {
//               "type": "text",
//               "text": "123 ",
//               "cheermote": null,
//               "emote": null,
//               "mention": null
//           },
//           {
//               "type": "emote",
//               "text": "PMSTwin",
//               "cheermote": null,
//               "emote": {
//                   "id": "92",
//                   "emote_set_id": "0",
//                   "owner_id": "0",
//                   "format": [
//                       "static"
//                   ]
//               },
//               "mention": null
//           },
//           {
//               "type": "text",
//               "text": " 456 ",
//               "cheermote": null,
//               "emote": null,
//               "mention": null
//           },
//           {
//               "type": "emote",
//               "text": "daishi7Anim4",
//               "cheermote": null,
//               "emote": {
//                   "id": "emotesv2_cd30dbf0d31a4a0694da792084d60922",
//                   "emote_set_id": "458689797",
//                   "owner_id": "179777714",
//                   "format": [
//                       "static",
//                       "animated"
//                   ]
//               },
//               "mention": null
//           },
//           {
//               "type": "text",
//               "text": " 789",
//               "cheermote": null,
//               "emote": null,
//               "mention": null
//           }
//       ]
//   },
//   "color": "#5F9EA0",
//   "badges": [
//       {
//           "set_id": "broadcaster",
//           "id": "1",
//           "info": ""
//       },
//       {
//           "set_id": "subscriber",
//           "id": "0",
//           "info": "32"
//       },
//       {
//           "set_id": "turbo",
//           "id": "1",
//           "info": ""
//       }
//   ],
//   "source_badges": null,
//   "message_type": "text",
//   "cheer": null,
//   "reply": null,
//   "channel_points_custom_reward_id": null,
//   "channel_points_animation_id": null
// }



// {
//   "id": "179777714",
//   "login": "daishihmr",
//   "display_name": "だいし",
//   "type": "",
//   "broadcaster_type": "affiliate",
//   "description": "恐竜とかヒーローのゲームが好きです",
//   "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/1c4c3f68-1d5c-482e-9751-13832e1bef63-profile_image-300x300.png",
//   "offline_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/52ed8a19-f5eb-494c-ac53-c6a7462a20a2-channel_offline_image-1920x1080.jpeg",
//   "view_count": 0,
//   "created_at": "2017-10-30T05:48:37Z"
// }
