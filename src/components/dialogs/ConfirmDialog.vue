<template>
  <q-dialog v-model="model">
    <q-card
      class="bg-grey-10 text-white q-pa-md rounded-borders"
      style="min-width: 300px; max-width: 400px"
    >
      <div class="text-h6 q-mb-sm">
        <q-icon :name="`sym_o_${icon}`" color="primary" class="q-mr-sm" />
        {{ title }}
      </div>

      <div class="text-body2 q-mb-md">{{ message }}</div>

      <q-separator />

      <div class="row justify-end q-gutter-sm q-mt-md">
        <q-btn flat label="Cancel" color="grey-5" @click="model = false" />
        <q-btn flat label="Yes" color="primary" @click="confirm" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
const model = defineModel()
defineEmits(['confirm'])

defineProps({
  title: { type: String, default: 'Confirm' },
  message: String,
  icon: { type: String, default: 'help' },
})

function confirm() {
  model.value = false
  setTimeout(() => {
    // avoid animation jank
    emit('confirm')
  }, 200)
}
</script>
