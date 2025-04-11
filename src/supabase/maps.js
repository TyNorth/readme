import { supabase } from 'src/boot/supabase'

export async function getMapsByUniverse(universeId) {
  const { data, error } = await supabase.from('maps').select('*').eq('universe_id', universeId)

  if (error) throw error
  return data
}

export async function createMap(payload) {
  const { data, error } = await supabase.from('maps').insert([payload]).select().single()

  if (error) throw error
  return data
}

export async function updateMap(id, updates) {
  const { data, error } = await supabase.from('maps').update(updates).eq('id', id).select().single()

  if (error) throw error
  return data
}
