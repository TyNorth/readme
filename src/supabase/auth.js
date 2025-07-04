import { supabase } from 'src/boot/supabase'

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUpWithEmail(email, password, username) {
  // <-- Added username
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        // <-- Pass username as metadata
        username: username,
      },
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function getSession() {
  return supabase.auth.getSession()
}
