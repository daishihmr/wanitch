export const audioContext = new AudioContext()
export const gainNode = audioContext.createGain()
gainNode.connect(audioContext.destination)
