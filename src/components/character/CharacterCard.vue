<template>
  <q-card
    flat
    bordered
    class="bg-grey-9 text-white q-pa-md rounded-borders cursor-pointer"
    @click="$emit('click')"
  >
    <q-avatar size="64px" class="q-mb-sm">
      <img :src="portrait" alt="portrait" />
    </q-avatar>

    <div class="text-subtitle1 text-gold">{{ name }}</div>
    <div class="text-caption text-grey-4">{{ alias }}</div>

    <div class="q-mt-sm row q-gutter-xs">
      <q-chip
        v-for="tag in tags"
        :key="tag"
        dense
        size="sm"
        color="primary"
        text-color="white"
        icon="sym_o_loyalty"
      >
        {{ tag }}
      </q-chip>
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  name: String,
  alias: String,
  portrait: String,
  tags: {
    type: Array,
    default: () => [],
  },
})
defineEmits(['click'])
</script>
