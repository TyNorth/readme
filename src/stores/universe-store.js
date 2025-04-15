import { defineStore } from 'pinia'
import {
  getPublicUniverses,
  getUniversesForUser,
  updateUniverse,
  getUniverseById,
} from '@/supabase/universes'

export const useUniverseStore = defineStore('universes', {
  state: () => ({
    universes: [],
    universe: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasUniverses: (state) => state.universes.length > 0,
  },

  actions: {
    async fetchPublicUniverses() {
      this.loading = true
      this.error = null
      try {
        this.universes = await getPublicUniverses()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async fetchUniverse(universeId) {
      if (!universeId) return
      this.loading = true
      this.error = null
      try {
        const universe = await getUniverseById(universeId)
        this.universe = [universe] // or set a separate `this.universe`
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async fetchUserUniverses(userId) {
      this.loading = true
      this.error = null
      try {
        this.universes = await getUniversesForUser(userId)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async updateUniverseTags(universeId, tags) {
      const updated = await updateUniverse(universeId, { tags })
      const index = this.universes.findIndex((u) => u.id === universeId)
      if (index !== -1) this.universes[index] = updated
      return updated
    },
  },
})
