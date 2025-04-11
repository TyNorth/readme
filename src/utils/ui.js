export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function openInNewTab(url) {
  window.open(url, '_blank')
}
