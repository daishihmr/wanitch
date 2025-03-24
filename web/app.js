import wslocal from './utils/wslocal.js'
import service from './utils/service.js'
import effect from './utils/effect.js'

import { TwitchClip } from './components/TwitchClip.js'
import { VideoPlayer } from './components/VideoPlayer.js'
import { Comments } from './components/Comments.js'
import { Wanis } from './components/Wani.js'
import { Emotes } from './components/Emote.js'

export default {
  components: {
    TwitchClip,
    VideoPlayer,
    Comments,
    Wanis,
    Emotes,
  },
  mounted () {
    effect.videoPlayer = this.$refs.videoPlayer
    effect.twitchClip = this.$refs.twitchClip
    effect.comments = this.$refs.comments
    effect.wanis = this.$refs.wanis
    effect.emotes = this.$refs.emotes

    wslocal.on('chat', async ({ event, user }) => {
      console.log(event, user)
      const isAdmin = event.badges.some(_ => _.set_id == 'broadcaster' || _.set_id == 'moderator')
      const text = event.message.text
      const args = text.split(' ')
      if (args[0].startsWith('!')) {
        switch (args[0]) {
          case '!help': {
            await effect.help()
            break
          }
          case '!trustme': {
            effect.trustme()
            break
          }
          case '!short': {
            effect.short()
            break
          }
          case '!okaeri': {
            effect.okaeri()
            break
          }
          case '!wani': {
            effect.wani()
            break
          }
          case '!dame': {
            effect.dame()
            break
          }
          case '!so': {
            if (args[1] && isAdmin) {
              effect.playClip(args[1])
            }
            break
          }
          case '!shoot': {
            effect.playSmallVideo('./resources/minigun.mp4')
            break
          }
          case '!asu': {
            effect.playFullscreenVideo('./resources/dance_1.webm', './resources/asu.mp3')
            break
          }
          case '!kurukuru': {
            effect.playFullscreenVideo('./resources/kurukuru.webm', './resources/kurukuru.mp3')
            break
          }
          case '!nani': {
            effect.playSmallVideo('./resources/nani_ver1.mov')
            break
          }
          case '!hero': {
            effect.playSound('./resources/伝説になるのだ.mp3')
            break
          }
        }
      } else {
        if (!text.startsWith('-')) {
          if (user.login != 'daishihmr_bot') {
            effect.showComment(event)
          }

          effect.emote(event)
        }
      }
    })
    wslocal.on('channel-points', ({ event, user }) => {
      console.log(event, user)
      switch (event.reward.title) {
        case 'おかえり': {
          effect.okaeri()
          break
        }
        case 'だめだね': {
          effect.dame()
          break
        }
        case 'short チキチキ': {
          effect.playShort('./resources/ss_chikichiki.mov')
          break
        }
        case 'short HOLD ME,homie': {
          effect.playShort('./resources/ss_holdme.mov')
          break
        }
        case 'short LADYCRAZY': {
          effect.playShort('./resources/ss_ladycrazy.mov')
          break
        }
        case 'short 筋肉': {
          effect.playShort('./resources/ss_kinniku.mp4')
          break
        }
        case 'short 愛包': {
          effect.playShort('./resources/ss_aipai.mov')
          break
        }
        case 'short キスキツネ': {
          effect.playShort('./resources/ss キスキツネ.mov')
          break
        }
        case '「萌え萌えキュンキュン」': {
          effect.playSound('./resources/萌え萌えキュンキュン.mp3')
          break
        }
        case '「伝説になるのだ」': {
          effect.playSound('./resources/伝説になるのだ.mp3')
          break
        }
        case '「信じて！」': {
          effect.trustme()
          break
        }
        case '「ありゃワニだ」': {
          effect.wani()
          break
        }
        case 'くるくる': {
          effect.playFullscreenVideo('./resources/kurukuru.webm', './resources/kurukuru.mp3')
          break
        }
        case 'shortランダム再生': {
          effect.short()
          break
        }
        case '「伝説になるのだ」': {
          effect.playSound('./resources/伝説になるのだ.mp3')
          break
        }
        case '明日までに100万円用意しろさもなくば奴の命と鍵のありかは闇に葬られる': {
          effect.playFullscreenVideo('./resources/dance_1.webm', './resources/asu.mp3')
          break
        }
        case 'GG': {
          service.postchat('daishi7Gg')
          break
        }
        case 'Nice!': {
          service.postchat('daishi7Nice')
          break
        }
        case '?': {
          service.postchat('daishi7What')
          break
        }
        case 'HI!': {
          service.postchat('daishi7Hi')
          break
        }
        case '❤': {
          service.postchat('daishi7Heartl daishi7Heartr')
          break
        }
      }
    })
    wslocal.on('subscribe', ({ event, user }) => {
      console.log(event, user)
      effect.playSound('./resources/Far Away (Sting) - MK2.mp3', 0.2)
    })
    wslocal.on('bits', ({ event, user }) => {
      console.log(event, user)
      effect.playSound('./resources/スタジアムの歓声1.mp3', 0.2)
    })
    wslocal.on('raid', ({ event, user }) => {
      console.log(event, user)
      effect.playSound('./resources/levelup.mp3', 0.2)
    })
  },
  template: `
  <div class="app">
    <TwitchClip ref="twitchClip" />
    <VideoPlayer ref="videoPlayer" />
    <Comments ref="comments" />
    <Wanis ref="wanis" />
    <Emotes ref="emotes" />
  </div>
  `
}
