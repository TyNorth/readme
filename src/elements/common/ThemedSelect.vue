<template>
  <div class="themed-select-wrapper">
    <div v-if="label" class="themed-label">{{ label }}</div>

    <q-select
      v-bind="$attrs"
      v-model="model"
      dense
      filled
      :color="color"
      class="themed-select"
      :options="options"
      :use-input="useInput"
      :multiple="multiple"
      :new-value-mode="newValueMode"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Array],
  label: String,
  color: {
    type: String,
    default: 'primary',
  },
  options: {
    type: Array,
    default: () => [],
  },
  useInput: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  newValueMode: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const model = ref(props.modelValue)

watch(model, (val) => emit('update:modelValue', val))
watch(
  () => props.modelValue,
  (val) => (model.value = val),
)
</script>

<style scoped>
.themed-select-wrapper {
  margin-bottom: 1rem;
}

.themed-label {
  font-family: 'Spectral', serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #c49a43;
  margin-bottom: 0.3rem;
}

.themed-select :deep(.q-field__control) {
  background: #1b1d1f;
  border: 1px solid rgba(255, 215, 100, 0.2);
  border-radius: 8px;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.themed-select :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 10px rgba(255, 215, 100, 0.4);
  border-color: #c49a43;
}
</style>
