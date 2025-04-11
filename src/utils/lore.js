export function filterLoreByType(loreList, type) {
  return loreList.filter((l) => l.type === type)
}

export function sortLoreByTitle(loreList) {
  return [...loreList].sort((a, b) => a.title.localeCompare(b.title))
}
