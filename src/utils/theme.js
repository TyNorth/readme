export function getThemeStyles(theme) {
  return {
    '--accent': theme?.accent || 'gold',
    '--background': theme?.background || '#121212',
    '--font': theme?.font || 'serif',
  }
}

export function applyTheme(styles) {
  for (const key in styles) {
    document.documentElement.style.setProperty(key, styles[key])
  }
}
