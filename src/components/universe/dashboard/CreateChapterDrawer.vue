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
import { ref, watch } from 'vue' // Make sure watch is imported
import { supabase } from '@/boot/supabase'
import ThemedInput from '@/elements/common/ThemedInput.vue'
import ThemedTextarea from '@/elements/common/ThemedTextarea.vue'
import ThemedDrawerHeader from '@/elements/common/ThemedDrawerHeader.vue'
import ThemedSubmitBar from '@/elements/common/ThemedSubmitBar.vue'
import { Notify } from 'quasar' // For user feedback
import { useUserStore } from 'src/stores/user-store'

const model = defineModel({ default: false }) // If you use v-model on parent
const emit = defineEmits(['created'])
const props = defineProps({
  storyId: {
    type: String,
    required: true,
  },
  creatorId: {
    // This is your authId from the parent
    type: String,
    default: null, // It might initially be null
  },
})

const loading = ref(false)
const defaultForm = () => ({
  title: '',
  summary: '',
  number: '', // Consider converting to integer before submit if DB type is integer
  story_id: props.storyId,
  creator_id: props.creatorId, // Initialize with prop
})

const form = ref(defaultForm())

// Watch for changes in the model (drawer open/close) and props
watch(
  [model, () => props.creatorId, () => props.storyId],
  ([isDrawerOpen, newCreatorId, newStoryId]) => {
    if (isDrawerOpen) {
      // When the drawer opens, or if critical props change while it's open, reset/re-initialize the form
      form.value.title = ''
      form.value.summary = ''
      form.value.number = '' // Or a default number like 1
      form.value.story_id = newStoryId
      form.value.creator_id = newCreatorId // This is the key update
      console.log(
        'CreateChapterDrawer form initialized/updated:',
        JSON.parse(JSON.stringify(form.value)),
      )
    }
  },
  { immediate: true },
) // immediate: true might be useful if drawer can start open with props already set

async function submit() {
  if (!form.value.creator_id) {
    Notify.create({ type: 'negative', message: 'Creator ID is missing. Cannot create chapter.' })
    console.error('Chapter submission error: creator_id is null or undefined in form.', form.value)
    return
  }
  if (!form.value.story_id) {
    Notify.create({ type: 'negative', message: 'Story ID is missing. Cannot create chapter.' })
    console.error('Chapter submission error: story_id is null or undefined in form.', form.value)
    return
  }

  loading.value = true
  try {
    const payload = { ...form.value }
    // Ensure 'number' is an integer if your DB expects it
    if (payload.number !== '' && payload.number !== null) {
      const parsedNumber = parseInt(payload.number, 10)
      if (!isNaN(parsedNumber)) {
        payload.number = parsedNumber
      } else {
        // Handle invalid number input, e.g., notify user or set to null
        Notify.create({
          type: 'warning',
          message: 'Chapter number is invalid, submitting without it.',
        })
        payload.number = null
      }
    } else {
      payload.number = null // Ensure it's null if empty, not an empty string
    }

    console.log('Inserting chapter with payload:', JSON.parse(JSON.stringify(payload)))
    console.log('Current authUser ID for RLS check:', useUserStore().authUser?.id)
    console.log('Inserting chapter with payload:', JSON.parse(JSON.stringify(payload)))

    const { data, error } = await supabase.from('chapters').insert([payload]).select().single()

    if (error) {
      console.error('Supabase error creating chapter:', error)
      Notify.create({ type: 'negative', message: `Error creating chapter: ${error.message}` })
      throw error // Re-throw to be caught by the outer catch if needed, or handle fully here
    }

    Notify.create({ type: 'positive', message: 'Chapter created successfully!' })
    emit('created', data)
    model.value = false // Close drawer
  } catch (err) {
    // This will catch errors from the Supabase call if re-thrown, or other JS errors
    // The Notify message from the Supabase error block is often more specific
    console.error('Submit function error:', err)
    if (!err.message.includes('Error creating chapter')) {
      // Avoid double notification
      Notify.create({
        type: 'negative',
        message: 'Failed to create chapter. See console for details.',
      })
    }
  } finally {
    loading.value = false
  }
}
</script>
