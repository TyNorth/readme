<template>
  <div
    class="absolute cursor-pointer"
    :style="{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }"
    @click="$emit('click')"
  >
    <q-icon name="sym_o_location_on" color="red" size="24px" class="q-mb-xs" />
    <q-tooltip v-if="label">{{ label }}</q-tooltip>
  </div>
</template>

<script setup>
defineProps({
  x: Number,
  y: Number,
  label: String,
})
defineEmits(['click'])
</script>
