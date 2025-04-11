import { ref } from 'vue'
import { getPublicUniverses, getUniversesForUser, createUniverse } from '@/supabase/universes'

export function useUniverse() {
  const universes = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchPublic() {
    loading.value = true
    try {
      universes.value = await getPublicUniverses()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function fetchForUser(userId) {
    loading.value = true
    try {
      universes.value = await getUniversesForUser(userId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    return await createUniverse(payload)
  }

  return { universes, loading, error, fetchPublic, fetchForUser, create }
}
