<template>
  <div class="editable-tags row items-center q-gutter-sm">
    <div v-if="!editing" class="row items-center q-gutter-xs">
      <q-chip
        v-for="tag in localTags"
        :key="tag"
        dense
        size="sm"
        color="primary"
        text-color="white"
        icon="sym_o_style"
      >
        {{ tag }}
      </q-chip>
      <q-chip v-if="!localTags.length && !editing" dense size="sm" outline color="grey-6">
        No tags
      </q-chip>
      <q-btn
        flat
        round
        dense
        icon="sym_o_edit"
        size="sm"
        @click="startEditing"
        aria-label="Edit tags"
      />
    </div>

    <div v-else class="row items-center q-gutter-xs full-width">
      <q-input
        v-model="input"
        dense
        filled
        label="New tag"
        @keyup.enter="addTag"
        class="q-mb-none col-auto"
        style="min-width: 100px; flex-grow: 1"
        :dark="$q.dark.isActive"
      />
      <q-btn flat round dense icon="sym_o_add" size="sm" @click="addTag" aria-label="Add tag" />

      <q-chip
        v-for="tag in localTags"
        :key="tag"
        dense
        removable
        size="sm"
        color="primary"
        text-color="white"
        @remove="removeTag(tag)"
        icon="sym_o_style"
      >
        {{ tag }}
      </q-chip>

      <q-btn
        flat
        round
        dense
        icon="sym_o_check"
        size="sm"
        @click="finishEditing"
        aria-label="Finish editing tags"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])

const editing = ref(false)
const input = ref('')

// **FIX 1: Safe initialization of localTags**
// Ensure localTags is always an array, even if modelValue is initially null or undefined.
const localTags = ref([])

// Function to synchronize localTags with props.modelValue safely
function syncLocalTags() {
  localTags.value = Array.isArray(props.modelValue) ? [...props.modelValue] : []
}

// **FIX 2: Watch for external changes and update localTags safely**
watch(
  () => props.modelValue,
  (newVal) => {
    // Only update if the external value is truly different from our internal copy
    // This helps prevent potential infinite loops if parent updates are not perfectly managed
    if (JSON.stringify(newVal) !== JSON.stringify(localTags.value)) {
      syncLocalTags()
    }
  },
  { deep: true }, // Watch for changes within the array if the parent mutates it
)

// Initialize on mount
onMounted(() => {
  syncLocalTags()
})

function startEditing() {
  syncLocalTags() // Ensure localTags is up-to-date before editing
  editing.value = true
}

function addTag() {
  const value = input.value.trim()
  if (value && !localTags.value.includes(value)) {
    localTags.value.push(value)
  }
  input.value = ''
}

function removeTag(tag) {
  localTags.value = localTags.value.filter((t) => t !== tag)
}

function finishEditing() {
  // Emit a new array copy to ensure reactivity for the parent
  emit('update:modelValue', [...localTags.value])
  editing.value = false
}
</script>

<style scoped>
.editable-tags .q-chip {
  margin-top: 2px; /* Ensure chips have a bit of space if they wrap */
  margin-bottom: 2px;
}
.editable-tags .q-input {
  margin-right: 4px; /* Spacing before add button */
}
</style>
