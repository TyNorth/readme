<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    side="right"
    overlay
    bordered
    :width="500"
    class="bg-grey-10 text-white"
  >
    <q-toolbar class="bg-grey-9">
      <q-toolbar-title>Create New Lore Entry</q-toolbar-title>
      <q-btn flat round dense icon="sym_o_close" @click="emit('update:modelValue', false)" />
    </q-toolbar>

    <q-form @submit.prevent="submitNewLoreEntry" class="q-pa-md q-gutter-md">
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
          label="Create Lore"
          type="submit"
          color="primary"
          :loading="loading"
          class="full-width"
        />
        <q-btn
          label="Cancel"
          flat
          @click="emit('update:modelValue', false)"
          class="full-width q-mt-sm"
        />
      </div>
    </q-form>
  </q-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/boot/supabase'
import { Notify } from 'quasar'

const props = defineProps({
  modelValue: Boolean, // For v-model from parent
  universeId: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'created'])

const defaultForm = () => ({
  title: '',
  type: 'General', // Default type
  summary: '',
  content: '',
  tags: [],
  universe_id: props.universeId,
})

const form = ref(defaultForm())
const loading = ref(false)

const loreTypes = [
  { label: 'General', value: 'General' },
  { label: 'History', value: 'History' },
  { label: 'Location', value: 'Location' },
  { label: 'Character Arcana', value: 'Character Arcana' }, // For character-specific non-bio lore
  { label: 'Item / Artifact', value: 'Item' },
  { label: 'Event', value: 'Event' },
  { label: 'Concept / System', value: 'Concept' }, // e.g., Magic System, Technology
  { label: 'Organization / Faction', value: 'Organization' },
  { label: 'Species / Race', value: 'Species' },
  { label: 'Culture', value: 'Culture' },
]

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      form.value = defaultForm() // Reset form when drawer opens
      form.value.universe_id = props.universeId // Ensure universe_id is set
    }
  },
)

async function submitNewLoreEntry() {
  if (!props.universeId) {
    Notify.create({ type: 'negative', message: 'Universe ID is missing.' })
    return
  }
  form.value.universe_id = props.universeId // Ensure it's set

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('lore_entries')
      .insert([form.value])
      .select()
      .single()

    if (error) throw error

    Notify.create({ type: 'positive', message: 'Lore entry created successfully!' })
    emit('created', data)
    emit('update:modelValue', false) // Close drawer
  } catch (err) {
    console.error('Error creating lore entry:', err)
    Notify.create({ type: 'negative', message: `Failed to create lore entry: ${err.message}` })
  } finally {
    loading.value = false
  }
}
</script>
