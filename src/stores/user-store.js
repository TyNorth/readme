import { defineStore } from 'pinia'
import { supabase } from '@/boot/supabase'
import { getUserProfile, updateUserProfile } from '@/supabase/users'

export const useUserStore = defineStore('user', {
  state: () => ({
    authUser: null, // Supabase Auth user
    profile: null, // Your custom profile
    loading: false,
    error: null,
    creatorMode: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.authUser,
    inCreatorMode: (state) => !!state.creatorMode,
    userId: (state) => state.authUser?.id || null,
  },

  actions: {
    async initialize() {
      this.loading = true
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        if (error) throw error

        this.authUser = user
        if (this.authUser) {
          await this.fetchProfile(this.authUser.id)
        } else {
          this.profile = null
        }
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async fetchProfile(userId) {
      this.loading = true
      try {
        const data = await getUserProfile(userId)
        if (data) console.info(`fetch profile successful!`)
        this.profile = data
        this.creatorMode = data?.creator_enabled || false
      } catch (err) {
        this.error = err
        this.profile = null
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

    // *** Add a Logout Action (Example) ***
    async logout() {
      this.loading = true
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        // Clear state
        this.authUser = null
        this.profile = null
        this.creatorMode = false
        this.error = null
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    setCreatorMode(val) {
      this.creatorMode = val
    },
  },
})
