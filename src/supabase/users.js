import { supabase } from 'src/boot/supabase'

export async function getUserProfile(userId) {
  const { data, error } = await supabase.from('users').select('*').eq('user_id', userId).single()

  // It's good practice to not throw an error if no row is found (PGRST116),
  // as a profile might simply not exist yet.
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error)
    throw error
  }

  if (data) console.info(`user profile data loaded successfully!`)

  return data
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
  return data
}
