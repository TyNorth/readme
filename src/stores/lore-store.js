import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoreByUniverse } from '@/supabase/lore'

export const useLoreStore = defineStore('lore', () => {
  const lore = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchLore(universeId) {
    loading.value = true
    try {
      lore.value = await getLoreByUniverse(universeId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { lore, loading, error, fetchLore }
})
