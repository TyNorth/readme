import { supabase } from 'src/boot/supabase'

/**
 * Fetch the first map for a universe (safe version)
 * If multiple maps exist, returns the first one
 */
export async function getMapsByUniverse(universeId) {
  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('universe_id', universeId)
    .limit(1)

  if (error) throw error
  return data?.[0] || null
}

/**
 * Create a new map entry for a universe
 */
export async function createMap(payload) {
  const { data, error } = await supabase.from('maps').insert([payload]).select().single()

  if (error) throw error
  return data
}

/**
 * Update a map by ID
 */
export async function updateMap(id, updates) {
  const { data, error } = await supabase.from('maps').update(updates).eq('id', id).select().single()

  if (error) throw error
  return data
}
