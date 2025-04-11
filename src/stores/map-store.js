import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMapsByUniverse } from '@/supabase/maps'

export const useMapStore = defineStore('maps', () => {
  const maps = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchMaps(universeId) {
    loading.value = true
    try {
      maps.value = await getMapsByUniverse(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { maps, loading, error, fetchMaps }
})
