import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCommentsByChapter } from '@/supabase/comments'

export const useCommentStore = defineStore('comments', () => {
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchComments(chapterId) {
    loading.value = true
    try {
      comments.value = await getCommentsByChapter(chapterId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { comments, loading, error, fetchComments }
})
