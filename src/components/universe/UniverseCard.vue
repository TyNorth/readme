<template>
  <q-card
    flat
    bordered
    class="q-pa-md bg-grey-10 text-white rounded-borders cursor-pointer"
    @click="$emit('click')"
  >
    <q-img
      :src="banner"
      ratio="16/9"
      spinner-color="white"
      class="rounded-borders overflow-hidden"
    />
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
      <div class="text-caption text-grey-4">{{ summary }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  title: String,
  summary: String,
  banner: String,
})
defineEmits(['click'])
</script>
