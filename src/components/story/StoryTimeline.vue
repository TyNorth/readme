<template>
  <div class="scroll-row no-wrap q-mt-md q-px-sm q-gutter-sm">
    <q-chip
      v-for="(scene, i) in scenes"
      :key="scene.id"
      :label="`Scene ${i + 1}`"
      clickable
      @click="$emit('select', scene)"
      :color="scene.id === activeId ? 'primary' : 'grey-8'"
      text-color="white"
      icon="sym_o_bookmark"
    />
  </div>
</template>

<script setup>
defineProps({
  scenes: Array,
  activeId: String,
})
defineEmits(['select'])
</script>

<style scoped>
.scroll-row {
  display: flex;
  overflow-x: auto;
  padding-bottom: 4px;
}
</style>
