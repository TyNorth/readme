import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()

export function parseMarkdown(raw) {
  return md.render(raw)
}

export function extractTags(text) {
  return [...text.matchAll(/#(\w+)/g)].map((m) => m[1])
}
