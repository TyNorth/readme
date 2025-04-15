import { defineStore } from 'pinia'
import { getMapsByUniverse } from '@/supabase/maps'

export const useMapStore = defineStore('maps', {
  state: () => ({
    maps: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMaps(universeId) {
      this.loading = true
      this.error = null
      try {
        this.maps = await getMapsByUniverse(universeId)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
  },
})
