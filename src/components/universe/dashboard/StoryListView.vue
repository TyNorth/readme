<template>
  <q-card flat bordered class="bg-grey-9 text-white">
    <q-table :rows="stories" :columns="columns" row-key="id" flat dense class="story-table">
      <!-- Title -->
      <template #body-cell-title="props">
        <q-td>
          <div class="text-subtitle2 text-gold">{{ props.row.title }}</div>
          <div class="text-caption text-grey-5">{{ props.row.summary }}</div>
        </q-td>
      </template>

      <!-- Status -->
      <template #body-cell-visibility="props">
        <q-td>
          <q-badge :label="props.row.visibility" color="primary" outline class="text-capitalize" />
        </q-td>
      </template>

      <!-- Tags -->
      <template #body-cell-tags="props">
        <q-td>
          <q-chip
            v-for="tag in props.row.tags"
            :key="tag"
            dense
            size="sm"
            color="primary"
            text-color="white"
            class="q-mr-xs q-mb-xs"
          >
            {{ tag }}
          </q-chip>
        </q-td>
      </template>

      <!-- Actions -->
      <template #body-cell-actions="props">
        <q-td class="text-right">
          <q-btn flat dense round icon="sym_o_edit" @click="$emit('edit', props.row)" />
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script setup>
defineProps({
  stories: Array,
})

const columns = [
  { name: 'title', label: 'Story', align: 'left', field: 'title', sortable: true },
  { name: 'visibility', label: 'Status', align: 'left', field: 'visibility' },
  { name: 'tags', label: 'Tags', align: 'left', field: 'tags' },
  { name: 'actions', label: '', align: 'right' },
]
</script>

<style scoped>
.story-table {
  font-size: 0.9rem;
}
</style>
