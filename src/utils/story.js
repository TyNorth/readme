export function countWords(text) {
  return text?.trim().split(/\s+/).length || 0
}

export function countLines(text) {
  return text?.split('\n').length || 0
}

export function sceneTitle(number, title = '') {
  return `Scene ${number}${title ? ': ' + title : ''}`
}
