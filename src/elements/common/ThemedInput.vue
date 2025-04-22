<template>
  <div class="themed-input-wrapper">
    <div v-if="label" class="themed-label">{{ label }}</div>

    <q-input v-bind="$attrs" v-model="model" dense :color="color" class="themed-input" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  color: {
    type: String,
    default: 'primary',
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
.themed-input-wrapper {
  margin-bottom: 1rem;
}
.themed-label {
  font-family: 'Spectral', serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #c49a43;
  margin-bottom: 0.3rem;
}
.themed-input :deep(.q-field__control) {
  background: #1b1d1f;
  border: 1px solid rgba(255, 215, 100, 0.2);
  border-radius: 8px;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.themed-input :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 10px rgba(255, 215, 100, 0.4);
  border-color: #c49a43;
}
</style>
