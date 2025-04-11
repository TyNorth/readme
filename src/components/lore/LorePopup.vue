<template>
  <q-dialog v-model="model">
    <q-card class="q-pa-md bg-grey-10 text-white" style="min-width: 300px; max-width: 500px">
      <div class="row items-center q-gutter-sm">
        <q-icon :name="`sym_o_${icon}`" color="primary" />
        <div class="text-h6">{{ title }}</div>
      </div>

      <q-separator class="q-my-md" />

      <div class="text-body2" v-html="content" />

      <q-btn
        flat
        label="Close"
        color="primary"
        icon="sym_o_close"
        class="q-mt-md"
        @click="model = false"
        align="right"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
const model = defineModel()
defineProps({
  title: String,
  content: String,
  icon: {
    type: String,
    default: 'auto_stories',
  },
})
</script>
