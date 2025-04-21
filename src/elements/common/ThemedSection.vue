<template>
  <div class="themed-section q-pa-md">
    <div class="section-header row items-center q-mb-md">
      <q-icon v-if="icon" :name="icon" size="20px" color="primary" class="q-mr-sm" />
      <div class="section-title text-gold">{{ title }}</div>
    </div>

    <div class="section-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: String,
})
</script>

<style scoped>
.themed-section {
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.02), transparent),
    linear-gradient(to bottom, #1a1b1d, #141516);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(255, 215, 100, 0.05);
  transition: all 0.3s ease;
}
.section-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.25rem;
}
.section-title {
  font-family: 'Spectral', serif;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
