<template>
  <q-icon :name="`sym_o_${name}`" :size="size" :color="color" v-bind="$attrs" />
</template>

<script setup>
defineProps({
  name: String,
  size: { type: String, default: 'md' },
  color: String,
})
</script>
