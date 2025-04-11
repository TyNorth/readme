import { supabase } from 'src/boot/supabase'

export async function getBookmarksByUser(userId) {
  const { data, error } = await supabase.from('bookmarks').select('*').eq('user_id', userId)

  if (error) throw error
  return data
}

export async function addBookmark(payload) {
  const { data, error } = await supabase.from('bookmarks').insert([payload]).select().single()

  if (error) throw error
  return data
}

export async function removeBookmark(id) {
  const { error } = await supabase.from('bookmarks').delete().eq('id', id)

  if (error) throw error
}
