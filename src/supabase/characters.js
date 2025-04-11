import { supabase } from 'src/boot/supabase'

export async function getCharacters(universeId) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('universe_id', universeId)

  if (error) throw error
  return data
}

export async function createCharacter(payload) {
  const { data, error } = await supabase.from('characters').insert([payload]).select().single()

  if (error) throw error
  return data
}
