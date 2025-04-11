import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getBookmarksByUser } from '@/supabase/bookmarks'

export const useBookmarkStore = defineStore('bookmarks', () => {
  const bookmarks = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchBookmarks(userId) {
    loading.value = true
    try {
      bookmarks.value = await getBookmarksByUser(userId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { bookmarks, loading, error, fetchBookmarks }
})
