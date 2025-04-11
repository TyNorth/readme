import { supabase } from './client'

export async function getVoiceAssets(universeId) {
  const { data, error } = await supabase
    .from('voice_assets')
    .select('*')
    .eq('universe_id', universeId)

  if (error) throw error
  return data
}

export async function uploadVoiceAsset(payload) {
  const { data, error } = await supabase.from('voice_assets').insert([payload]).select().single()

  if (error) throw error
  return data
}
