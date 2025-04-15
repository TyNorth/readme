import { defineStore } from 'pinia'
import { getChaptersByStory } from '@/supabase/chapters'

export const useChapterStore = defineStore('chapters', {
  state: () => ({
    chapters: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchChapters(storyId) {
      this.loading = true
      this.error = null
      try {
        this.chapters = await getChaptersByStory(storyId)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
  },
})
