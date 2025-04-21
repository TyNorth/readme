import { supabase } from 'src/boot/supabase'

export async function getCharacters(universeId) {
  if (!universeId) throw new Error('Missing universeId')

  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('universe_id', universeId)

  if (error) {
    console.error('[getCharacters] Supabase error:', error)
    throw error
  }

  console.log('[getCharacters] Result:', data)
  return data
}

export async function createCharacter(payload) {
  const { data, error } = await supabase.from('characters').insert([payload]).select().single()

  if (error) throw error
  return data
}

export async function updateCharacter(id, updates) {
  const { data, error } = await supabase
    .from('characters')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[updateCharacter] Supabase error:', error)
    throw error
  }

  return data
}
