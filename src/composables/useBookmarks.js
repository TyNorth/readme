import { ref } from 'vue'
import { getBookmarksByUser, addBookmark, removeBookmark } from '@/supabase/bookmarks'

export function useBookmarks() {
  const bookmarks = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(userId) {
    loading.value = true
    try {
      bookmarks.value = await getBookmarksByUser(userId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function add(payload) {
    return await addBookmark(payload)
  }

  async function remove(id) {
    return await removeBookmark(id)
  }

  return { bookmarks, loading, error, fetch, add, remove }
}
