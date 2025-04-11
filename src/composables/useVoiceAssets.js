import { ref } from 'vue'
import { getVoiceAssets, uploadVoiceAsset } from '@/supabase/voiceAssets'

export function useVoiceAssets() {
  const assets = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(universeId) {
    loading.value = true
    try {
      assets.value = await getVoiceAssets(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function upload(payload) {
    return await uploadVoiceAsset(payload)
  }

  return { assets, loading, error, fetch, upload }
}
