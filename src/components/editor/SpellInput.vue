<template>
  <q-card flat bordered class="q-pa-md bg-grey-9 text-white rounded-borders">
    <q-input v-model="form.name" label="Spell Name" filled dense />
    <q-select
      v-model="form.type"
      label="Type"
      :options="['Elemental', 'Divine', 'Forbidden', 'Binding']"
      filled
      dense
      class="q-mt-sm"
    />
    <q-input
      v-model="form.description"
      label="Description"
      type="textarea"
      filled
      dense
      class="q-mt-sm"
    />
    <q-btn
      color="primary"
      icon="sym_o_save"
      label="Save Spell"
      class="q-mt-md"
      @click="$emit('save', form)"
    />
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  type: '',
  description: '',
})

defineEmits(['save'])
</script>
