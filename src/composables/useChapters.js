import { ref } from 'vue'
import { getChaptersByStory, createChapter, updateChapter } from '@/supabase/chapters'

export function useChapters() {
  const chapters = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(storyId) {
    loading.value = true
    try {
      chapters.value = await getChaptersByStory(storyId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    return await createChapter(payload)
  }

  async function update(id, updates) {
    return await updateChapter(id, updates)
  }

  return { chapters, loading, error, fetch, create, update }
}
