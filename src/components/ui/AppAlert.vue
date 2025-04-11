<template>
  <q-banner :class="`bg-${color} text-white`" class="q-pa-md rounded-borders" v-if="message">
    <template v-if="icon">
      <q-icon :name="`sym_o_${icon}`" class="q-mr-sm" />
    </template>
    {{ message }}
  </q-banner>
</template>

<script setup>
defineProps({
  message: String,
  color: { type: String, default: 'blue' },
  icon: { type: String, default: 'info' },
})
</script>
