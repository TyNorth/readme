<template>
  <div
    class="scene-card"
    @mousemove="handleMouseMove"
    @mouseleave="resetTransform"
    @click="$emit('click')"
  >
    <q-card
      flat
      bordered
      class="full-height q-pa-sm column justify-between"
      :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-light text-black'"
    >
      <!-- Title (top) -->
      <q-card-section class="q-px-sm q-pt-sm q-pb-xs">
        <div class="text-subtitle1 text-shimmer">{{ title }}</div>
      </q-card-section>

      <!-- Spacer -->
      <div class="q-mt-auto" />

      <!-- Summary (bottom) -->
      <q-card-section class="q-px-sm q-pt-xs q-pb-none">
        <div class="text-caption ellipsis-3-lines">{{ summary }}</div>
      </q-card-section>

      <!-- Tags (bottom) -->
      <q-card-section class="q-px-sm q-pt-xs q-pb-sm">
        <div class="row q-gutter-xs">
          <q-chip
            v-for="tag in tags"
            :key="tag"
            size="sm"
            dense
            color="primary"
            text-color="white"
            icon="sym_o_style"
          >
            {{ tag }}
          </q-chip>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  summary: String,
  tags: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['click'])

function handleMouseMove(e) {
  const cardEl = e.currentTarget
  const rect = cardEl.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -12
  const rotateY = ((x - centerX) / centerX) * 12
  cardEl.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

function resetTransform(e) {
  e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg)'
}
</script>

<style scoped>
.scene-card {
  height: 100%;
  width: 100%;
  max-width: 250px;
  min-height: 370px;
  perspective: 1000px;
  transition: transform 0.2s ease;
  transform-style: preserve-3d;
  cursor: pointer;
}
.scene-card > .q-card {
  border-radius: 12px;
  transition: box-shadow 0.3s ease;
}
.scene-card:hover > .q-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>
