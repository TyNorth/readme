<template>
  <div class="themed-drawer-header row items-center justify-between q-pa-md">
    <div class="text-h6 themed-title">{{ title }}</div>
    <q-btn icon="sym_o_close" flat dense round color="grey-5" @click="$emit('close')" />
  </div>
</template>

<script setup>
defineProps({
  title: String,
})
defineEmits(['close'])
</script>

<style scoped>
.themed-drawer-header {
  background: #1c1d20;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.themed-title {
  font-family: 'Spectral', serif;
  font-weight: 600;
  color: #c49a43;
  letter-spacing: 0.5px;
}
</style>
