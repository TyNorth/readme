<template>
  <q-card flat bordered class="bg-grey-9 text-white q-pa-md rounded-borders">
    <div class="text-subtitle2 q-mb-sm">Filter Lore</div>
    <q-select
      v-model="filters.type"
      label="Type"
      :options="types"
      filled
      dense
      clearable
      class="q-mb-sm"
    />
    <q-input v-model="filters.search" label="Search" dense filled debounce="300" class="q-mb-sm" />
    <q-btn
      label="Clear"
      flat
      icon="sym_o_clear"
      color="white"
      class="q-mt-sm"
      @click="clearFilters"
    />
  </q-card>
</template>

<script setup>
const filters = defineModel()
const types = [
  'location',
  'event',
  'artifact',
  'magic',
  'creature',
  'concept',
  'timeline',
  'language',
  'faction',
]

function clearFilters() {
  filters.value.type = ''
  filters.value.search = ''
}
</script>
