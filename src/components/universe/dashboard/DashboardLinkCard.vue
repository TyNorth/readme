<template>
  <q-card
    flat
    bordered
    class="dashboard-link-card bg-grey-9 text-white cursor-pointer"
    @click="$emit('click')"
  >
    <q-card-section class="row items-center q-gutter-md">
      <q-icon :name="icon" size="32px" color="primary" />
      <div>
        <div class="text-subtitle2 text-gold">{{ title }}</div>
        <div v-if="subtitle" class="text-caption text-grey-5">{{ subtitle }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  icon: {
    type: String,
    default: 'sym_o_folder',
  },
})
defineEmits(['click'])
</script>

<style scoped>
.dashboard-link-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.dashboard-link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
