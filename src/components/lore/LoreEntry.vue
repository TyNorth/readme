<template>
  <q-card
    flat
    bordered
    class="q-pa-md bg-grey-9 text-white rounded-borders cursor-pointer"
    @click="$emit('click')"
  >
    <div class="row items-center q-gutter-sm q-mb-sm">
      <q-icon :name="`sym_o_${icon}`" color="primary" />
      <div class="text-subtitle1">{{ title }}</div>
    </div>
    <div class="text-caption text-grey-4 ellipsis-3-lines">{{ summary }}</div>
  </q-card>
</template>

<script setup>
defineProps({
  title: String,
  summary: String,
  icon: {
    type: String,
    default: 'auto_stories',
  },
})
defineEmits(['click'])
</script>
