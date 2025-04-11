import { ref } from 'vue'
import { getCharacters, createCharacter } from '@/supabase/characters'

export function useCharacters() {
  const characters = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(universeId) {
    loading.value = true
    try {
      characters.value = await getCharacters(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    return await createCharacter(payload)
  }

  return { characters, loading, error, fetch, create }
}
