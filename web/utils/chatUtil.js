export default {
  toSimpleText (message) {
    return message.fragments.filter(_ => _.type == 'text').map(f => f.text).join('')
  }
}
