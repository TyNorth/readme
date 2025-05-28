<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="width: 500px; max-width: 90vw" class="bg-grey-10 text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-gold">Create New Universe</div>
        <q-space />
        <q-btn icon="sym_o_close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit.prevent="submitForm">
        <q-card-section class="q-pt-lg q-gutter-md">
          <q-input
            v-model="formData.title"
            label="Universe Title *"
            filled
            dark
            :rules="[(val) => !!val || 'Title is required']"
            lazy-rules
            autofocus
          />
          <q-input
            v-model="formData.summary"
            label="Short Summary / Tagline"
            type="textarea"
            filled
            dark
            autogrow
          />
          <q-select
            filled
            dark
            v-model="formData.tags"
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add-unique"
            label="Tags (e.g., Fantasy, Sci-Fi)"
          />
          <q-select
            v-model="formData.visibility"
            label="Visibility"
            filled
            dark
            :options="['private', 'public']"
            hint="Private universes are only visible to you."
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn label="Create Universe" color="primary" type="submit" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
// *** IMPORT THE SPECIFIC SUPABASE FUNCTION ***
import { createUniverse } from '@/supabase/universes'
import { useUserStore } from '@/stores/user-store'
import { Notify } from 'quasar'

const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue', 'created'])

const userStore = useUserStore()
const loading = ref(false)
const formData = ref({
  title: '',
  summary: '',
  tags: [],
  visibility: 'private',
})

async function submitForm() {
  loading.value = true
  try {
    const user = userStore.authUser
    if (!user) {
      throw new Error('You must be logged in to create a universe.')
    }

    // *** USE THE IMPORTED createUniverse FUNCTION ***
    const data = await createUniverse({
      title: formData.value.title,
      summary: formData.value.summary,
      tags: formData.value.tags,
      visibility: formData.value.visibility,
      owner_id: user.id, // Make sure this matches your DB column!
    })

    Notify.create({
      type: 'positive',
      message: `Universe "${data.title}" created successfully!`,
      icon: 'sym_o_hub',
    })
    emit('created', data)
    emit('update:modelValue', false)

    formData.value = { title: '', summary: '', tags: [], visibility: 'private' }
  } catch (error) {
    console.error('Error creating universe:', error)
    Notify.create({
      type: 'negative',
      message: `Failed to create universe: ${error.message || 'Unknown error'}`,
    })
  } finally {
    loading.value = false
  }
}
</script>
