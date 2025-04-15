<template>
  <q-card
    flat
    class="lore-card bg-grey-9 text-white rounded-borders cursor-pointer"
    @click="$emit('click')"
  >
    <q-card-section class="column justify-between full-height q-pa-md">
      <div class="text-subtitle1 text-gold">{{ title }}</div>
      <div class="text-caption text-grey-5 ellipsis-3-lines">
        {{ summary }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  title: String,
  summary: String,
})
defineEmits(['click'])
</script>

<style scoped>
.lore-card {
  width: 100%;
  min-height: 220px;
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.lore-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}
</style>
