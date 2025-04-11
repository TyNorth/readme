<template>
  <q-dialog v-model="model">
    <q-card class="q-pa-md bg-grey-9 text-white" style="min-width: 300px; max-width: 600px">
      <div class="text-h6 q-mb-sm">Assign Character</div>

      <q-select
        filled
        dense
        v-model="selected"
        :options="characters"
        option-label="name"
        label="Select character"
        emit-value
        map-options
        class="q-mb-md"
      />

      <div class="row justify-end q-gutter-sm">
        <q-btn flat label="Cancel" color="grey-5" @click="model = false" />
        <q-btn flat label="Assign" color="primary" @click="assign" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const model = defineModel()
const emit = defineEmits(['assign'])

defineProps({
  characters: Array,
})

const selected = ref(null)

function assign() {
  model.value = false
  emit('assign', selected.value)
}
</script>
