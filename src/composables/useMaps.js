import { ref } from 'vue'
import { getMapsByUniverse, createMap, updateMap } from '@/supabase/maps'

export function useMaps() {
  const maps = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(universeId) {
    loading.value = true
    try {
      maps.value = await getMapsByUniverse(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    return await createMap(payload)
  }

  async function update(id, updates) {
    return await updateMap(id, updates)
  }

  return { maps, loading, error, fetch, create, update }
}
