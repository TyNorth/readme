import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserProfile, updateUserProfile } from '@/supabase/users'

export const useUserStore = defineStore('user', () => {
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const creatorMode = ref(false)

  async function fetchProfile(userId) {
    loading.value = true
    try {
      profile.value = await getUserProfile(userId)
      creatorMode.value = profile.value.creator_enabled || false
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(userId, updates) {
    try {
      profile.value = await updateUserProfile(userId, updates)
    } catch (err) {
      error.value = err
    }
  }

  function setCreatorMode(val) {
    creatorMode.value = val
  }

  return { profile, loading, error, fetchProfile, updateProfile, setCreatorMode }
})
