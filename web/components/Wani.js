import animejs from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/+esm'
import service from '../utils/service.js'

const maskColors = [
  [255, 0, 0],
  [0, 255, 0],
  [0, 255, 0],
  [0, 255, 255],
  [255, 255, 0],
  [255, 0, 255],
]

export const Wani = {
  props: ['wani'],
  async mounted () {
    await this.initialize()
  },
  data: () => ({
    src: null,
    dinoName: '',
  }),
  methods: {
    async initialize () {
      const waniElm = this.$refs.wani
      animejs.set(waniElm, {
        left: '1920px',
        top: `${(1080 - 800) / 2}px`,
      })
      animejs.timeline({ targets: waniElm })
      .add({
        left: `${(1920 - 800) / 2}px`,
        duration: 800,
        easing: 'easeOutBack',
      })
      .add({
        complete: () => {
          this.wani.ended = true
          this.$emit('ended')
        }
      }, '+=2500')

      this.dinoName = this.wani.imagePair.dino.replace('./resources/wani/', '').replace('.png', '')

      if (!this.wani.imagePair.mask) {
        this.src = this.wani.imagePair.dino
      } else {
        const colors = Array.from(Array(6)).map((_) => {
          return [
            0 + Math.floor(Math.random() * 256),
            0 + Math.floor(Math.random() * 256),
            0 + Math.floor(Math.random() * 256),
            255,
          ]
        })
        // console.log(colors)
  
        const maskCanvas = document.createElement('canvas')
        maskCanvas.width = 256
        maskCanvas.height = 256
        const maskContext = maskCanvas.getContext('2d')
        const maskImage = new Image()
        await new Promise((resolve) => {
          maskImage.onload = () => {
            maskContext.drawImage(maskImage, 0, 0, 256, 256)
            resolve()
          }
          maskImage.src = this.wani.imagePair.mask
        })
  
        const _maskData = maskContext.getImageData(0, 0, 256, 256)
        const maskData = _maskData.data
        const _colorData = maskContext.createImageData(256, 256)
        const colorData = _colorData.data
        for (let i = 0; i < maskData.length; i += 4) {
          if (maskData[i + 0] == 0 && maskData[i + 1] == 0 && maskData[i + 2] == 0) {
            colorData[i + 0] = 255
            colorData[i + 1] = 255
            colorData[i + 2] = 255
            colorData[i + 3] = 0
          } else {
            maskColors.forEach((m, j) => {
              const distance = Math.hypot(maskData[i + 0] - m[0], maskData[i + 1] - m[1], maskData[i + 2] - m[2])
              if (distance < 441) {
                colorData[i + 0] += colors[j][0] * (1 - distance / 441)
                colorData[i + 1] += colors[j][1] * (1 - distance / 441)
                colorData[i + 2] += colors[j][2] * (1 - distance / 441)
                colorData[i + 3] = 255
              }
            })
          }
        }
  
        const dinoCanvas = document.createElement('canvas')
        dinoCanvas.width = 256
        dinoCanvas.height = 256
        const dinoContext = dinoCanvas.getContext('2d')
        const dinoImage = new Image()
        await new Promise((resolve) => {
          dinoImage.onload = () => {
            dinoContext.drawImage(dinoImage, 0, 0, 256, 256)
            resolve()
          }
          dinoImage.src = this.wani.imagePair.dino
        })
  
        const _dinoData = dinoContext.getImageData(0, 0, 256, 256)
        const dinoData = _dinoData.data
        for (let i = 0; i < dinoData.length; i += 4) {
          if (dinoData[i + 3] != 0) {
            dinoData[i + 0] = Math.floor(dinoData[i + 0] * colorData[i + 0] / 255)
            dinoData[i + 1] = Math.floor(dinoData[i + 1] * colorData[i + 1] / 255)
            dinoData[i + 2] = Math.floor(dinoData[i + 2] * colorData[i + 2] / 255)
          }
        }
        dinoContext.putImageData(_dinoData, 0, 0)
  
        this.src = dinoCanvas.toDataURL()
      }
    },
  },
  template: `
  <div ref="wani" class="wani">
    <img class="wani-image" v-if="src" :src="src" />
    <div class="wani-name">{{ dinoName }}</div>
  </div>
  `,
}

export const Wanis = {
  components: {
    Wani,
  },
  data: () => ({
    lastId: -1,
    imagePairs: [],
    wanis: [],
  }),
  async mounted () {
    await this.initialize()
  },
  methods: {
    async initialize () {
      const files = await service.getfiles('./resources/wani')
      this.imagePairs = files.data.filter(_ => _.endsWith('.png') && !_.endsWith('_m.png')).map((file) => ({
        dino: './resources/wani/' + file,
        mask: files.data.includes(file.replace('.png', '_m.png')) ? ('./resources/wani/' + file.replace('.png', '_m.png')) : null,
      }))
    },
    add () {
      this.wanis.push({
        id: 'wani-' + (++this.lastId),
        imagePair: this.imagePairs.random(),
        ended: false,
      })
    },
    onended (wani) {
      this.wanis = this.wanis.filter(_ => _.id != wani.id)
    },
  },
  template: `
  <div class="wanis">
    <Wani v-for="(wani, index) in wanis" :key="wani.id" :wani="wani" @ended="onended(wani)" />
  </div>
  `,
}

// 0 赤 rgb(255,0,0)
// 1 緑 rgb(0,255,0)
// 2 青 rgb(0,0,255)
// 3 水 rgb(0,255,255)
// 4 黄 rgb(255,255,0)
// 5 紫 rgb(255,0,255)
