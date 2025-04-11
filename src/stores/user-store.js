import { defineStore } from 'pinia'
import { getUserProfile, updateUserProfile } from '@/supabase/users'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    loading: false,
    error: null,
    creatorMode: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.profile,
    inCreatorMode: (state) => !!state.creatorMode,
  },

  actions: {
    async fetchProfile(userId) {
      this.loading = true
      try {
        const data = await getUserProfile(userId)
        this.profile = data
        this.creatorMode = data?.creator_enabled || false
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async updateProfile(userId, updates) {
      try {
        const data = await updateUserProfile(userId, updates)
        this.profile = data
      } catch (err) {
        this.error = err
      }
    },

    setCreatorMode(val) {
      this.creatorMode = val
    },
  },
})
