import { supabase } from 'src/boot/supabase'

export async function getLoreByUniverse(universeId) {
  const { data, error } = await supabase
    .from('lore_entries')
    .select('*')
    .eq('universe_id', universeId)

  if (error) throw error
  return data
}

export async function createLoreEntry(payload) {
  const { data, error } = await supabase.from('lore_entries').insert([payload]).select().single()

  if (error) throw error
  return data
}
