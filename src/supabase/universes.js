import { supabase } from 'src/boot/supabase'

export async function getUniversesForUser(userId) {
  const { data: u, error } = await supabase.from('universes').select('*').eq('owner_id', userId)

  if (error) throw error
  return u
}

export async function getUniverseById(id) {
  const { data, error } = await supabase.from('universes').select('*').eq('owner_id', id).single()
  console.log(data)

  if (error) throw error
  return data
}

export async function getPublicUniverses() {
  const { data, error } = await supabase.from('universes').select('*').eq('visibility', 'public')

  if (error) throw error
  return data
}

export async function createUniverse(payload) {
  const { data, error } = await supabase.from('universes').insert([payload]).select().single()

  if (error) throw error
  return data
}

export async function updateUniverse(id, updates) {
  const { data, error } = await supabase
    .from('universes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
