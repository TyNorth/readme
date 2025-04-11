import { supabase } from 'src/boot/supabase'

export async function getCommentsByChapter(chapterId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function postComment(payload) {
  const { data, error } = await supabase.from('comments').insert([payload]).select().single()

  if (error) throw error
  return data
}
