import { supabase } from 'src/boot/supabase'

export async function getChaptersByStory(storyId) {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', storyId)
    .order('number', { ascending: true })

  if (error) throw error
  return data
}

export async function createChapter(payload) {
  const { data, error } = await supabase.from('chapters').insert([payload]).select().single()

  if (error) throw error
  return data
}

export async function updateChapter(id, updates) {
  const { data, error } = await supabase
    .from('chapters')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
