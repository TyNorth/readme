import { ref } from 'vue'
import { signInWithEmail, signUpWithEmail, signOut, getSession } from '@/supabase/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const session = ref(null)
  const error = ref(null)
  const router = useRouter()

  async function login(email, password) {
    try {
      const { session: s } = await signInWithEmail(email, password)
      session.value = s
      return session.value
    } catch (err) {
      error.value = err
    }
  }

  async function register(email, password) {
    try {
      await signUpWithEmail(email, password)
    } catch (err) {
      error.value = err
    }
  }

  async function logout() {
    try {
      await signOut()
      router.push('/auth/login')
      session.value = null
    } catch (err) {
      error.value = err
    }
  }

  async function fetchSession() {
    const { data } = await getSession()
    session.value = data.session
  }

  return { session, error, login, register, logout, fetchSession }
}
