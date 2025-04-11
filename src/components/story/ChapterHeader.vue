<template>
  <div class="q-mb-md">
    <div class="text-h5 text-white">{{ title }}</div>
    <div class="text-subtitle2 text-grey-5 q-mt-xs">{{ subtitle }}</div>

    <q-separator class="q-my-md" color="primary" />

    <slot name="extra" />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
})
</script>
