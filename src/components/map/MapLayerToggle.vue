<template>
  <q-btn-toggle
    v-model="model"
    :options="options"
    toggle-color="primary"
    flat
    dense
    class="q-mt-sm"
    v-bind="$attrs"
  />
</template>

<script setup>
const model = defineModel()

defineProps({
  options: {
    type: Array,
    default: () => [
      { label: 'Terrain', value: 'terrain', icon: 'sym_o_terrain' },
      { label: 'Factions', value: 'factions', icon: 'sym_o_groups' },
      { label: 'Events', value: 'events', icon: 'sym_o_auto_stories' },
    ],
  },
})
</script>
