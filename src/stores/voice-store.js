import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getVoiceAssets } from '@/supabase/voiceAssets'

export const useVoiceStore = defineStore('voiceAssets', () => {
  const voiceAssets = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchVoiceAssets(universeId) {
    loading.value = true
    try {
      voiceAssets.value = await getVoiceAssets(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { voiceAssets, loading, error, fetchVoiceAssets }
})
