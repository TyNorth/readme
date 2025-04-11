<template>
  <q-toolbar class="bg-grey-10 text-gold shadow-1 q-px-md">
    <q-btn dense flat round icon="sym_o_arrow_back" @click="$router.back()" class="q-mr-sm" />

    <q-toolbar-title class="text-h6">
      {{ title }}
    </q-toolbar-title>

    <q-space />

    <slot name="actions" />
  </q-toolbar>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Universe',
  },
})
</script>
