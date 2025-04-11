<template>
  <q-timeline color="primary" layout="dense" side="left">
    <q-timeline-entry
      v-for="entry in entries"
      :key="entry.id"
      :title="entry.title"
      :subtitle="entry.subtitle"
      :icon="`sym_o_${entry.icon || 'auto_stories'}`"
      class="text-white"
    >
      <div class="text-grey-4" v-html="entry.content" />
    </q-timeline-entry>
  </q-timeline>
</template>

<script setup>
defineProps({
  entries: {
    type: Array,
    default: () => [],
  },
})
</script>
