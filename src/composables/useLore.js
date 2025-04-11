import { ref } from 'vue'
import { getLoreByUniverse, createLoreEntry } from '@/supabase/lore'

export function useLore() {
  const lore = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(universeId) {
    loading.value = true
    try {
      lore.value = await getLoreByUniverse(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    return await createLoreEntry(payload)
  }

  return { lore, loading, error, fetch, create }
}
