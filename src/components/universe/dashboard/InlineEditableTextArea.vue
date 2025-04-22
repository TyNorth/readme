<template>
  <div class="editable-textarea">
    <div v-if="!editing" class="read-mode">
      <div class="text-body2" style="white-space: pre-line">{{ modelValue || 'Empty...' }}</div>
      <q-btn flat round dense icon="sym_o_lock" size="sm" class="q-mt-sm" @click="editing = true" />
    </div>

    <div v-else class="edit-mode">
      <q-input
        v-model="localValue"
        type="textarea"
        filled
        dense
        autofocus
        :autogrow="autoHeight"
        @blur="finish"
        class="q-mb-none"
      />
      <q-btn flat rounded dense icon="sym_o_lock_open" size="sm" class="q-mt-sm" @click="finish" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  autoHeight: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

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
  emit('save') // 🔁 Trigger save on lock toggle
}
</script>
