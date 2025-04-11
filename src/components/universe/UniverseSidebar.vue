<template>
  <q-list padding class="text-white">
    <q-item
      v-for="link in links"
      :key="link.label"
      clickable
      :to="link.to"
      active-class="bg-primary text-white"
      exact
    >
      <q-item-section avatar>
        <q-icon :name="`sym_o_${link.icon}`" />
      </q-item-section>
      <q-item-section>{{ link.label }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
defineProps({
  links: {
    type: Array,
    default: () => [
      { label: 'Overview', icon: 'dashboard', to: 'overview' },
      { label: 'Stories', icon: 'menu_book', to: 'stories' },
      { label: 'Characters', icon: 'face', to: 'characters' },
      { label: 'Lore', icon: 'auto_stories', to: 'lore' },
      { label: 'Map', icon: 'map', to: 'map' },
    ],
  },
})
</script>
