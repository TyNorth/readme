<template>
  <q-card
    flat
    bordered
    class="q-pa-md bg-grey-9 text-white rounded-borders cursor-pointer"
    @click="$emit('click')"
  >
    <div class="text-subtitle2 text-gold">{{ number ? `Scene ${number}` : '' }}</div>
    <div class="text-h6 q-mb-sm">{{ title }}</div>
    <div class="text-caption text-grey-4 ellipsis-3-lines">{{ summary }}</div>

    <q-chip
      v-for="tag in tags"
      :key="tag"
      dense
      size="sm"
      class="q-mt-sm q-mr-xs"
      color="primary"
      text-color="white"
      icon="sym_o_style"
    >
      {{ tag }}
    </q-chip>
  </q-card>
</template>

<script setup>
defineProps({
  title: String,
  summary: String,
  number: Number,
  tags: {
    type: Array,
    default: () => [],
  },
})
defineEmits(['click'])
</script>
