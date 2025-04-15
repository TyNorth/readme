import { defineStore } from 'pinia'
import { getBookmarksByUser } from '@/supabase/bookmarks'

export const useBookmarkStore = defineStore('bookmarks', {
  state: () => ({
    bookmarks: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBookmarks(userId) {
      this.loading = true
      this.error = null
      try {
        this.bookmarks = await getBookmarksByUser(userId)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
  },
})
