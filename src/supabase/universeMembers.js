import { supabase } from 'src/boot/supabase'

export async function getMembersByUniverse(universeId) {
  const { data, error } = await supabase
    .from('universe_members')
    .select('*, users(username, avatar_url)')
    .eq('universe_id', universeId)

  if (error) throw error
  return data
}

export async function addUniverseMember(payload) {
  const { data, error } = await supabase
    .from('universe_members')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeUniverseMember(id) {
  const { error } = await supabase.from('universe_members').delete().eq('id', id)

  if (error) throw error
}
