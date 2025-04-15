<template>
  <div class="dashboard-header row items-center justify-between q-mb-md q-mt-sm">
    <div class="column">
      <div class="text-h5 text-shimmer">{{ title }}</div>
      <div v-if="subtitle" class="text-caption text-grey-5 q-mt-xs">{{ subtitle }}</div>
    </div>

    <div class="row items-center q-gutter-sm">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.dashboard-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.75rem;
}
</style>
