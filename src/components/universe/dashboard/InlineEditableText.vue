<template>
  <div class="editable-field row items-center q-gutter-sm">
    <div v-if="!editing" class="text-body1">
      {{ modelValue }}
      <q-btn flat round dense icon="sym_o_lock" size="sm" @click="editing = true" />
    </div>

    <div v-else class="row items-center q-gutter-sm">
      <q-input
        v-model="localValue"
        dense
        filled
        autofocus
        @blur="finish"
        @keyup.enter="finish"
        class="q-mb-none"
      />
      <q-btn flat round dense icon="sym_o_lock_open" size="sm" @click="finish" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])

const editing = ref(false)
const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val
  },
)

function finish() {
  editing.value = false
  emit('update:modelValue', localValue.value)
}
</script>
