import { ref } from 'vue'
import { getCommentsByChapter, postComment } from '@/supabase/comments'

export function useComments() {
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(chapterId) {
    loading.value = true
    try {
      comments.value = await getCommentsByChapter(chapterId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function post(payload) {
    return await postComment(payload)
  }

  return { comments, loading, error, fetch, post }
}
