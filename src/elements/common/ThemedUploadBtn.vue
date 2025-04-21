<template>
  <div class="themed-upload-wrapper">
    <div class="themed-label">{{ label }}</div>

    <div v-if="previewUrl" class="q-mb-sm">
      <q-img v-if="isImage" :src="previewUrl" style="max-height: 200px; border-radius: 8px" />
      <audio
        v-else-if="isAudio"
        :src="previewUrl"
        controls
        style="width: 100%; margin-bottom: 0.5rem"
      />
    </div>

    <q-file
      v-if="!previewUrl"
      dense
      filled
      :label="uploadLabel"
      :accept="accept"
      class="themed-upload"
      v-model="file"
    />

    <q-btn
      v-if="previewUrl"
      flat
      dense
      color="negative"
      icon="sym_o_delete"
      label="Remove"
      @click="clear"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: File,
  previewUrl: String,
  accept: String,
  label: String,
  uploadLabel: {
    type: String,
    default: 'Upload File',
  },
})
const emit = defineEmits(['update:modelValue', 'clear'])

const file = ref(props.modelValue)

watch(file, (val) => emit('update:modelValue', val))
watch(
  () => props.modelValue,
  (val) => (file.value = val),
)

const isImage = computed(() => props.accept?.includes('image'))
const isAudio = computed(() => props.accept?.includes('audio'))

function clear() {
  emit('update:modelValue', null)
  emit('clear')
}
</script>

<style scoped>
.themed-upload-wrapper {
  margin-bottom: 1rem;
}
.themed-label {
  font-family: 'Spectral', serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #c49a43;
  margin-bottom: 0.3rem;
}
.themed-upload :deep(.q-field__control) {
  background: #1b1d1f;
  border: 1px solid rgba(255, 215, 100, 0.2);
  border-radius: 8px;
}
</style>
