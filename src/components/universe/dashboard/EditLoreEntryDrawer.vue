<template>
  <q-drawer
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    @show="populateForm"
    side="right"
    overlay
    bordered
    :width="500"
    class="bg-grey-10 text-white"
  >
    <q-toolbar class="bg-grey-9">
      <q-toolbar-title>Edit Lore Entry</q-toolbar-title>
      <q-btn flat round dense icon="sym_o_close" @click="closeDrawer" />
    </q-toolbar>

    <q-card-section v-if="!currentLoreEntry" class="q-pa-md text-center">
      <q-spinner color="primary" size="2em" class="q-mb-sm" />
      <div>Loading entry details...</div>
    </q-card-section>

    <q-form v-else @submit.prevent="submitUpdateLoreEntry" class="q-pa-md q-gutter-md">
      <q-input
        v-model="form.title"
        label="Title *"
        filled
        dark
        lazy-rules
        :rules="[(val) => !!val || 'Title is required']"
        autofocus
      />
      <q-select
        v-model="form.type"
        label="Type"
        :options="loreTypes"
        filled
        dark
        emit-value
        map-options
        hint="Categorize your lore entry"
      />
      <q-input
        v-model="form.summary"
        label="Summary / Short Description"
        type="textarea"
        filled
        dark
        autogrow
        hint="A brief overview of this lore."
      />
      <q-input
        v-model="form.content"
        label="Full Content / Details *"
        type="textarea"
        filled
        dark
        autogrow
        rows="7"
        lazy-rules
        :rules="[(val) => !!val || 'Content is required']"
        hint="The main body of your lore entry."
      />
      <q-select
        v-model="form.tags"
        label="Tags (Optional)"
        filled
        dark
        multiple
        use-input
        use-chips
        hide-dropdown-icon
        new-value-mode="add-unique"
        hint="Add relevant tags to help organize."
      />

      <div class="q-mt-lg">
        <q-btn
          label="Save Changes"
          type="submit"
          color="primary"
          :loading="loading"
          class="full-width"
        />
        <q-btn label="Cancel" flat @click="closeDrawer" class="full-width q-mt-sm" />
      </div>
    </q-form>
  </q-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/boot/supabase'
import { Notify } from 'quasar'

const props = defineProps({
  modelValue: Boolean, // For v-model from parent (controls drawer visibility)
  loreEntryToEdit: {
    // The lore entry object to edit
    type: Object,
    default: null,
  },
  creatorId: {
    type: String,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'updated'])

// Use a different name for the internal ref to avoid confusion with prop
const currentLoreEntry = ref(null)

const defaultFormState = () => ({
  title: '',
  type: 'general',
  summary: '',
  content: '',
  tags: [],
  creator_id: props.creatorId,
})

const form = ref(defaultFormState())
const loading = ref(false)

const loreTypes = [
  // Same as in CreateLoreEntryDrawer
  { label: 'General', value: 'general' },
  { label: 'History', value: 'history' },
  { label: 'Location', value: 'location' },
  { label: 'Character Arcana', value: 'character arcana' },
  { label: 'Item / Artifact', value: 'item' },
  { label: 'Event', value: 'event' },
  { label: 'Concept / System', value: 'concept' },
  { label: 'Organization / Faction', value: 'organization' },
  { label: 'Species / Race', value: 'species' },
  { label: 'Culture', value: 'culture' },
]

// Function to populate form when drawer opens or prop changes
function populateForm() {
  if (props.loreEntryToEdit) {
    currentLoreEntry.value = { ...props.loreEntryToEdit } // Work with a copy
    form.value.title = currentLoreEntry.value.title || ''
    form.value.type = currentLoreEntry.value.type || 'general'
    form.value.summary = currentLoreEntry.value.summary || ''
    form.value.content = currentLoreEntry.value.content || ''
    form.value.tags = Array.isArray(currentLoreEntry.value.tags)
      ? [...currentLoreEntry.value.tags]
      : []
  } else {
    currentLoreEntry.value = null
    form.value = defaultFormState() // Reset if no entry
  }
}

// Watch for the drawer opening (modelValue becoming true) and when loreEntryToEdit changes
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      populateForm()
    }
  },
)

watch(
  () => props.loreEntryToEdit,
  () => {
    if (props.modelValue) {
      // Only repopulate if drawer is already open
      populateForm()
    }
  },
  { deep: true },
)

function closeDrawer() {
  emit('update:modelValue', false)
}

async function submitUpdateLoreEntry() {
  if (!currentLoreEntry.value || !currentLoreEntry.value.id) {
    Notify.create({ type: 'negative', message: 'No lore entry selected or entry is invalid.' })
    return
  }

  loading.value = true
  try {
    // Construct only the fields that should be updated
    // Exclude id, universe_id, created_at as they generally shouldn't be changed here
    const updatePayload = {
      title: form.value.title,
      type: form.value.type,
      summary: form.value.summary,
      content: form.value.content,
      tags: form.value.tags,
      // updated_at will be set by Supabase automatically
    }

    const { data, error } = await supabase
      .from('lore_entries')
      .update(updatePayload)
      .eq('id', currentLoreEntry.value.id) // Use the ID from the original prop data
      .select()
      .single()

    if (error) throw error

    Notify.create({ type: 'positive', message: 'Lore entry updated successfully!' })
    emit('updated', data) // Emit the updated entry
    closeDrawer()
  } catch (err) {
    console.error('Error updating lore entry:', err)
    Notify.create({ type: 'negative', message: `Failed to update lore entry: ${err.message}` })
  } finally {
    loading.value = false
  }
}
</script>
