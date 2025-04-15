import { defineStore } from 'pinia'
import { getCharacters } from '@/supabase/characters'

export const useCharacterStore = defineStore('characters', {
  state: () => ({
    characters: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCharacters(universeId) {
      this.loading = true
      this.error = null
      try {
        this.characters = await getCharacters(universeId)
        console.log(this.characters)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
  },
})
