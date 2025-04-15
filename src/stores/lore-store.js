import { defineStore } from 'pinia'
import { getLoreByUniverse } from '@/supabase/lore'

export const useLoreStore = defineStore('lore', {
  state: () => ({
    lore: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchLore(universeId) {
      this.loading = true
      this.error = null
      try {
        this.lore = await getLoreByUniverse(universeId)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
  },
})
