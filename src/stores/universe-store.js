import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPublicUniverses, getUniversesForUser } from '@/supabase/universes'

export const useUniverseStore = defineStore('universes', () => {
  const universes = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchPublicUniverses() {
    loading.value = true
    try {
      universes.value = await getPublicUniverses()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function fetchUserUniverses(userId) {
    loading.value = true
    try {
      universes.value = await getUniversesForUser(userId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { universes, loading, error, fetchPublicUniverses, fetchUserUniverses }
})
