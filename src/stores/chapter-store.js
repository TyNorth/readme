import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getChaptersByStory } from '@/supabase/chapters'

export const useChapterStore = defineStore('chapters', () => {
  const chapters = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchChapters(storyId) {
    loading.value = true
    try {
      chapters.value = await getChaptersByStory(storyId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { chapters, loading, error, fetchChapters }
})
