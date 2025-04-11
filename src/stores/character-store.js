import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCharacters } from '@/supabase/characters'

export const useCharacterStore = defineStore('characters', () => {
  const characters = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCharacters(universeId) {
    loading.value = true
    try {
      characters.value = await getCharacters(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { characters, loading, error, fetchCharacters }
})
