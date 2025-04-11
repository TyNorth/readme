import { ref } from 'vue'
import { getStoriesByUniverse, createStory, updateStory } from '@/supabase/stories'

export function useStory() {
  const stories = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(universeId) {
    loading.value = true
    try {
      stories.value = await getStoriesByUniverse(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    try {
      return await createStory(payload)
    } catch (err) {
      error.value = err
    }
  }

  async function update(id, updates) {
    try {
      return await updateStory(id, updates)
    } catch (err) {
      error.value = err
    }
  }

  return { stories, loading, error, fetch, create, update }
}
