<template>
  <q-breadcrumbs class="text-subtitle2" separator="→">
    <q-breadcrumbs-el
      v-for="(crumb, i) in resolvedCrumbs"
      :key="crumb.to"
      :label="crumb.label"
      :icon="crumb.icon"
      :to="crumb.to"
      :class="{ 'crumb-active': i === resolvedCrumbs.length - 1 }"
    >
      <q-tooltip v-if="crumb.tooltip">{{ crumb.tooltip }}</q-tooltip>
    </q-breadcrumbs-el>
  </q-breadcrumbs>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUniverseStore } from '@/stores/universe-store'

const route = useRoute()
const universeStore = useUniverseStore()

const crumbs = computed(() => {
  return route.matched
    .filter((r) => r.meta?.breadcrumb)
    .map((r) => ({
      key: r.name || r.path,
      meta: r.meta,
      path: r.path.includes(':') ? route.fullPath : r.path,
    }))
})

const resolvedCrumbs = computed(() => {
  return crumbs.value.map((c) => {
    let label = c.meta.breadcrumb
    let tooltip = label
    let icon = c.meta.icon

    // Handle dynamic title: Universe
    if (c.meta.dynamic === 'universe') {
      const id = route.params.id
      const universe = universeStore.universes.find((u) => u.id === id)
      if (universe) {
        label = universe.title
        tooltip = universe.summary || universe.title
      }
    }

    return { label, tooltip, icon, to: c.path }
  })
})
</script>

<style scoped>
.crumb-active {
  font-weight: 600;
  color: var(--q-primary);
}

.q-breadcrumbs__el {
  transition: color 0.2s ease;
}
</style>
