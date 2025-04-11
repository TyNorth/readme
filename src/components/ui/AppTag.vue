<template>
  <q-chip
    square
    dense
    clickable
    :label="label"
    :color="color"
    :text-color="textColor"
    :icon="icon ? `sym_o_${icon}` : undefined"
    v-bind="$attrs"
  />
</template>

<script setup>
defineProps({
  label: String,
  color: { type: String, default: 'grey-9' },
  textColor: { type: String, default: 'white' },
  icon: String,
})
</script>
