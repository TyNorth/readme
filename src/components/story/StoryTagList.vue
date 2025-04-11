<template>
  <div class="row q-gutter-sm q-mt-sm">
    <q-chip
      v-for="tag in tags"
      :key="tag"
      dense
      color="grey-8"
      text-color="white"
      icon="sym_o_label"
      class="rounded-borders"
    >
      {{ tag }}
    </q-chip>
  </div>
</template>

<script setup>
defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
})
</script>
