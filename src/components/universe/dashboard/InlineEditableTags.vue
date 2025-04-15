<template>
  <div class="editable-tags row items-center q-gutter-sm">
    <div v-if="!editing" class="row items-center q-gutter-xs">
      <q-chip
        v-for="tag in modelValue"
        :key="tag"
        dense
        size="sm"
        color="primary"
        text-color="white"
        icon="sym_o_style"
      >
        {{ tag }}
      </q-chip>
      <q-btn flat round dense icon="sym_o_lock" size="sm" @click="editing = true" />
    </div>

    <div v-else class="row items-center q-gutter-xs full-width">
      <q-input
        v-model="input"
        dense
        filled
        label="New tag"
        @keyup.enter="addTag"
        class="q-mb-none"
      />
      <q-btn flat round dense icon="sym_o_add" size="sm" @click="addTag" />

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

      <q-btn flat round dense icon="sym_o_lock_open" size="sm" @click="finish" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])

const editing = ref(false)
const input = ref('')
const localTags = ref([...props.modelValue])

watch(
  () => props.modelValue,
  (val) => {
    localTags.value = [...val]
  },
)

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

function finish() {
  editing.value = false
  emit('update:modelValue', localTags.value)
}
</script>
