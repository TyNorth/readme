export function parseLoreContent({ rawText, characters = [], maps = [], universeId }) {
  if (!rawText) return ''

  const links = [
    ...characters.map((c) => ({
      name: c.name,
      route: `/universe/${universeId}/character/${c.id}`,
    })),
    ...maps.map((m) => ({
      name: m.name,
      route: `/universe/${universeId}/map/${m.id}`,
    })),
  ]

  let processedText = rawText

  links.forEach(({ name, route }) => {
    const pattern = new RegExp(`\\b(${escapeRegExp(name)})\\b`, 'gi')
    processedText = processedText.replace(
      pattern,
      `<a href="${route}" class="linked-entity">$1</a>`,
    )
  })

  return processedText
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
