import { supabase } from 'src/boot/supabase'

export async function getStoriesByUniverse(universeId) {
  const { data: s, error } = await supabase
    .from('stories')
    .select('*')
    .eq('universe_id', universeId)
    .eq('visibility', 'public')

  if (error) throw error
  return s
}

export async function createStory(payload) {
  const { data, error } = await supabase.from('stories').insert([payload]).select().single()

  if (error) throw error
  return data
}

export async function getStory(id) {
  const { data, error } = await supabase.from('stories').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

export async function updateStory(id, updates) {
  const { data, error } = await supabase
    .from('stories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
