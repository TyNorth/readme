<template>
  <q-dialog v-model="open" persistent transition-show="fade" transition-hide="fade">
    <q-card class="themed-wizard bg-grey-10 text-white" style="max-width: 500px; width: 100%">
      <q-toolbar class="bg-grey-9">
        <q-toolbar-title>Create Story</q-toolbar-title>
        <q-btn icon="sym_o_close" flat round dense @click="open = false" />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="submit" class="q-gutter-md">
          <ThemedInput v-model="form.title" label="Title" />
          <ThemedTextarea v-model="form.summary" label="Summary" />
          <ThemedSelect
            v-model="form.tags"
            label="Tags"
            multiple
            use-input
            new-value-mode="add-unique"
          />
          <q-select
            v-model="form.visibility"
            label="Visibility"
            filled
            dense
            :options="['draft', 'public']"
            class="themed-input"
          />
          <ThemedSubmitBar
            label="Create Story"
            :loading="loading"
            @submit="submit"
            @cancel="open = false"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue' // Import watch
import { supabase } from '@/boot/supabase'
import ThemedInput from '@/elements/common/ThemedInput.vue'
import ThemedTextarea from '@/elements/common/ThemedTextarea.vue'
import ThemedSelect from '@/elements/common/ThemedSelect.vue'
import ThemedSubmitBar from '@/elements/common/ThemedSubmitBar.vue'
import { useRouter } from 'vue-router'
import { notifyError, notifySuccess } from 'src/utils/notify' // Assuming you have notifySuccess

// Props definition
const props = defineProps({
  // modelValue is implicitly defined by defineModel() for the 'open' state
  currentUniverseId: {
    // Prop to pass the active universe_id
    type: String,
    default: null,
  },
})

const open = defineModel({ default: false }) // For v-model controlling dialog visibility
const emit = defineEmits(['created'])

const form = ref({
  title: '',
  summary: '',
  tags: [],
  visibility: 'draft',
  universe_id: null, // Will be set by prop
})

const loading = ref(false)
const router = useRouter()

// Watch for changes in the `open` state (when dialog is shown/hidden)
// and when the currentUniverseId prop changes.
watch(
  [open, () => props.currentUniverseId],
  ([isOpen, newUniverseId], [wasOpen, oldUniverseId]) => {
    if (isOpen) {
      // When the dialog opens, or if universeId prop changes while open, update the form
      form.value.universe_id = newUniverseId
      // Reset other form fields when dialog opens for a new story
      if (!wasOpen || newUniverseId !== oldUniverseId) {
        // Reset if just opened or universe changed
        form.value.title = ''
        form.value.summary = ''
        form.value.tags = []
        form.value.visibility = 'draft'
      }
    }
  },
  { immediate: true },
) // immediate: true to set initial universe_id if dialog starts open with prop

async function submit() {
  // Critical Check: Ensure universe_id is set
  if (!form.value.universe_id) {
    notifyError('Cannot create story: Universe ID is missing.')
    console.error('Form submission failed: form.value.universe_id is not set.', form.value)
    return // Stop if no universe_id
  }

  loading.value = true
  try {
    const payload = { ...form.value } // form.value already includes universe_id due to watcher
    console.log('Attempting to insert story with payload:', payload) // For debugging

    const { data, error } = await supabase
      .from('stories')
      .insert([payload]) // Use the spread form data
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating story:', error) // Log the full error object
      notifyError(`Error creating story: ${error.message || 'Unknown error'}`)
      // No need to set loading.value = false here, finally block will do it
      return // Stop execution on error
    }

    // Check if data and data.id exist
    if (data && data.id) {
      notifySuccess('Story created successfully!')
      emit('created', data)
      open.value = false // Close the dialog
      router.push(`/editor/${data.id}`) // Navigate to story editor
    } else {
      // This case means Supabase didn't error, but didn't return expected data.
      console.error(
        'Story creation possibly failed: No data or ID returned from Supabase, but no explicit error.',
        data,
      )
      notifyError('Story creation may have failed. Please check the console and your stories list.')
    }
  } catch (err) {
    // Catch any other unexpected JavaScript errors during the try block
    console.error('Unexpected error in submit function:', err)
    notifyError('An unexpected error occurred during story creation.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.themed-wizard {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 14px rgba(255, 215, 100, 0.05);
}
</style>
