import { supabase } from 'src/boot/supabase'

export async function getUserProfile(userId) {
  // *** FIX: Change 'id' to 'user_id' ***
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId) // <--- CORRECTED
    .single()

  // It's good practice to not throw an error if no row is found (PGRST116),
  // as a profile might simply not exist yet.
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error)
    throw error
  }

  console.log('Fetched Profile Data:', data) // Keep this log for now!
  return data
}

export async function updateUserProfile(userId, updates) {
  // *** FIX: Change 'id' to 'user_id' ***
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('user_id', userId) // <--- CORRECTED
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
  return data
}
