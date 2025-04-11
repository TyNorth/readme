import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStoriesByUniverse } from '@/supabase/stories'

export const useStoryStore = defineStore('stories', () => {
  const stories = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchStories(universeId) {
    loading.value = true
    try {
      stories.value = await getStoriesByUniverse(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { stories, loading, error, fetchStories }
})
