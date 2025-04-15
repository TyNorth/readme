import { Dark } from 'quasar'
import { watch } from 'vue'
import { useReaderOptionsStore } from '@/stores/reader-options-store'

export default async () => {
  const store = useReaderOptionsStore()

  const applyThemeClass = () => {
    const themeClass = `theme-${store.theme}`
    document.body.classList.remove('theme-dark', 'theme-light')
    document.body.classList.add(themeClass)
  }

  watch(
    () => store.theme,
    (val) => {
      Dark.set(val === 'dark')
      applyThemeClass()
      store.persist()
    },
    { immediate: true },
  )

  applyThemeClass()
  Dark.set(store.theme === 'dark')
}
