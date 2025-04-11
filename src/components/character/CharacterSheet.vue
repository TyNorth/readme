<template>
  <q-card flat class="bg-grey-10 text-white q-pa-md rounded-borders">
    <div class="row items-start q-gutter-md">
      <q-avatar size="96px">
        <img :src="portrait" alt="portrait" />
      </q-avatar>

      <div>
        <div class="text-h5 text-gold">{{ name }}</div>
        <div class="text-subtitle2 text-grey-5">{{ alias }}</div>
        <div class="q-mt-sm text-caption text-grey-4">{{ origin }}</div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <div class="text-body2 q-mb-md">{{ bio }}</div>

    <div class="row q-gutter-sm">
      <q-chip
        v-for="tag in tags"
        :key="tag"
        dense
        color="primary"
        text-color="white"
        icon="sym_o_star"
      >
        {{ tag }}
      </q-chip>
    </div>

    <slot name="footer" />
  </q-card>
</template>

<script setup>
defineProps({
  name: String,
  alias: String,
  bio: String,
  origin: String,
  portrait: String,
  tags: {
    type: Array,
    default: () => [],
  },
})
</script>
