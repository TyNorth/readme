<template>
  <q-tabs
    v-model="model"
    class="text-primary"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
    v-bind="$attrs"
  >
    <slot />
  </q-tabs>
</template>

<script setup>
const model = defineModel()
</script>
