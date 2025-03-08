const wslocal = {

  ws: null,
  listeners: {},

  on (eventType, func) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = []
    }
    this.listeners[eventType].push(func)
  },

  fire (eventType, ...args) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach((func) => {
        func(...args)
      })
    }
  },

  postChat (text) {
    console.log('postChat', text)
    if (this.ws) {
      this.ws.send(JSON.stringify({
        command: 'postchat',
        data: { text },
      }))
    }
  },

  _promise () {
    return new Promise((resolve) => {
      let retryCount = 0
    
      const connect = () => {
        this.ws = new WebSocket(`ws://localhost:${location.port}`, 'ws-local')
        this.ws.onopen = (e) => {
          console.log('opened')
          retryCount = 0

          resolve(this)
        }
        this.ws.onmessage = ({ data }) => {
          const msg = JSON.parse(data)
          console.log('ws.onmessage', msg)
          this.fire(msg.topic, msg.message)
        }
        this.ws.onerror = (e) => {
          console.error(e)
          retryCount += 1
        }
        this.ws.onclose = () => {
          console.log('closed')
          if (retryCount < 5) {
            setTimeout(() => {
              connect()
            }, 1000)
          }
        }
      }
    
      connect()
    })
  }
}

window.addEventListener('load', async () => {
  console.log('wslocal', wslocal)
  await wslocal._promise()
})

export default wslocal
