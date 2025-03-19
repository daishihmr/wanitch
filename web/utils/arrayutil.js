Array.prototype.random = function () {
  if (this.length === 0) return
  const index = Math.floor(Math.random() * this.length)
  return this[index]
}

export default {}
