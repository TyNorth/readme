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
import { ref, watch } from 'vue'
import { supabase } from '@/boot/supabase'
import ThemedInput from '@/elements/common/ThemedInput.vue'
import ThemedTextarea from '@/elements/common/ThemedTextarea.vue'
import ThemedSelect from '@/elements/common/ThemedSelect.vue'
import ThemedSubmitBar from '@/elements/common/ThemedSubmitBar.vue'
import { useRouter } from 'vue-router'
import { notifyError, notifySuccess } from 'src/utils/notify'
import { useUserStore } from '@/stores/user-store' // **** 1. Import useUserStore ****

const props = defineProps({
  currentUniverseId: {
    type: String,
    default: null,
  },
})

const open = defineModel({ default: false })
const emit = defineEmits(['created'])

const userStore = useUserStore() // **** 2. Initialize useUserStore ****

const form = ref({
  title: '',
  summary: '',
  tags: [],
  visibility: 'draft',
  universe_id: props.currentUniverseId,
  // creator_id will be added directly to the payload
})

const loading = ref(false)
const router = useRouter()

watch(
  [open, () => props.currentUniverseId],
  ([isOpen, newUniverseId], [wasOpen, oldUniverseId]) => {
    if (isOpen) {
      form.value.universe_id = newUniverseId
      if (!wasOpen || newUniverseId !== oldUniverseId) {
        form.value.title = ''
        form.value.summary = ''
        form.value.tags = []
        form.value.visibility = 'draft'
      }
    }
  },
  { immediate: true },
)

async function submit() {
  if (!form.value.universe_id) {
    notifyError('Universe ID is missing. Cannot create story.')
    console.error('Form submission failed: universe_id is null or undefined.', form.value)
    return
  }

  // **** 3. Get current user ID ****
  const currentAuthUser = userStore.authUser
  if (!currentAuthUser || !currentAuthUser.id) {
    notifyError('You must be logged in to create a story.')
    console.error('Form submission failed: User not authenticated.')
    return
  }

  loading.value = true
  try {
    // **** 4. Construct payload including creator_id ****
    const payload = {
      title: form.value.title,
      summary: form.value.summary,
      tags: form.value.tags,
      visibility: form.value.visibility,
      universe_id: form.value.universe_id,
      creator_id: currentAuthUser.id, // Add the creator_id
    }

    console.log('Attempting to insert story with payload:', payload)

    const { data, error } = await supabase.from('stories').insert([payload]).select().single()

    if (error) {
      console.error('Supabase error creating story:', error)
      notifyError(`Error creating story: ${error.message}`)
      return
    }

    if (data && data.id) {
      notifySuccess('Story created successfully!')
      emit('created', data)
      open.value = false
      router.push(`/editor/${data.id}`)
    } else {
      console.error(
        'Story creation failed: No data or ID returned, but no Supabase error reported.',
        data,
      )
      notifyError('Story creation failed. Please check console.')
    }
  } catch (err) {
    console.error('Unexpected error in submit function:', err)
    notifyError('An unexpected error occurred.')
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
