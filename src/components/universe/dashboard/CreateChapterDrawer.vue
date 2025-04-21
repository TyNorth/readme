<template>
  <q-drawer
    side="right"
    v-model="model"
    overlay
    behavior="mobile"
    width="420px"
    class="themed-drawer text-white"
  >
    <ThemedDrawerHeader title="Create Chapter" @close="model = false" />

    <q-scroll-area class="q-pa-md" style="height: calc(100% - 50px)">
      <q-form @submit.prevent="submit" class="q-gutter-md">
        <ThemedInput v-model="form.title" label="Chapter Title" />
        <ThemedTextarea v-model="form.summary" label="Summary (Optional)" />
        <ThemedInput v-model="form.number" label="Chapter Number" />

        <ThemedSubmitBar
          label="Create Chapter"
          :loading="loading"
          @submit="submit"
          @cancel="model = false"
        />
      </q-form>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/boot/supabase'
import ThemedInput from '@/elements/common/ThemedInput.vue'
import ThemedTextarea from '@/elements/common/ThemedTextarea.vue'
import ThemedDrawerHeader from '@/elements/common/ThemedDrawerHeader.vue'
import ThemedSubmitBar from '@/elements/common/ThemedSubmitBar.vue'

const model = defineModel()
const emit = defineEmits(['created'])
const props = defineProps({ storyId: String })

const loading = ref(false)

const form = ref({
  title: '',
  summary: '',
  number: '',
  story_id: props.storyId,
})

async function submit() {
  loading.value = true
  try {
    const { data, error } = await supabase.from('chapters').insert([form.value]).select().single()

    if (error) throw error
    emit('created', data)
    model.value = false
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
