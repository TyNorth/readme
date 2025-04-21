<template>
  <q-card flat bordered class="bg-grey-9 text-white">
    <q-table :rows="characters" :columns="columns" row-key="id" flat dense class="character-table">
      <template #body-cell-portrait_url="props">
        <q-td>
          <q-avatar size="36px">
            <img v-if="props.row.portrait_url" :src="props.row.portrait_url" />
            <q-icon v-else name="sym_o_face" color="grey-5" />
          </q-avatar>
        </q-td>
      </template>

      <template #body-cell-name="props">
        <q-td>{{ props.row.name }}</q-td>
      </template>

      <template #body-cell-alias="props">
        <q-td class="text-grey-5">{{ props.row.alias }}</q-td>
      </template>

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
  characters: Array,
})

const columns = [
  { name: 'portrait_url', label: '', align: 'left', field: 'portrait_url' },
  { name: 'name', label: 'Name', align: 'left', field: 'name' },
  { name: 'alias', label: 'Alias', align: 'left', field: 'alias' },
  { name: 'tags', label: 'Tags', align: 'left', field: 'tags' },
  { name: 'actions', label: '', align: 'right' },
]
</script>

<style scoped>
.character-table {
  font-size: 0.9rem;
}
</style>
