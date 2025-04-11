export function getAudioDuration(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url)
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration)
    })
  })
}
