import { defineStore } from 'pinia'
import { watch } from 'vue'

export const useReaderOptionsStore = defineStore('readerOptions', {
  state: () => ({
    fontSize: 'md',
    fontFamily: 'serif',
    lineHeight: 'normal',
    audioSpeed: 1.0,
    highContrast: false,
    immersionMode: false,
    theme: 'dark',
  }),

  actions: {
    reset() {
      this.fontSize = 'md'
      this.fontFamily = 'serif'
      this.lineHeight = 'normal'
      this.audioSpeed = 1.0
      this.highContrast = false
      this.immersionMode = false
      this.theme = 'dark'
    },

    persist() {
      localStorage.setItem('reader-options', JSON.stringify(this.$state))
    },

    loadFromStorage() {
      const saved = localStorage.getItem('reader-options')
      if (saved) {
        Object.assign(this, JSON.parse(saved))
      }
    },
  },
})

// Immediately watch for changes
watch(
  () => useReaderOptionsStore().$state,
  (val) => {
    localStorage.setItem('reader-options', JSON.stringify(val))
  },
  { deep: true },
)
