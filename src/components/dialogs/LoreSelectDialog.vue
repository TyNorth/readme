<template>
  <q-dialog v-model="model">
    <q-card class="q-pa-md bg-grey-9 text-white" style="min-width: 300px; max-width: 600px">
      <div class="text-h6 q-mb-sm">Attach Lore Entry</div>

      <q-input v-model="search" label="Search" dense filled class="q-mb-sm" />

      <q-list bordered separator class="scroll q-mb-md" style="max-height: 300px">
        <q-item v-for="entry in filtered" :key="entry.id" clickable v-ripple @click="select(entry)">
          <q-item-section avatar>
            <q-icon :name="`sym_o_${entry.icon || 'auto_stories'}`" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ entry.title }}</q-item-label>
            <q-item-label caption>{{ entry.type }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-btn flat label="Cancel" color="grey-5" @click="model = false" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const model = defineModel()
const emit = defineEmits(['select'])

const props = defineProps({
  entries: Array,
})

const search = ref('')

const filtered = computed(() => {
  return search.value.trim().length === 0
    ? props.entries
    : props.entries.filter((e) => e.title.toLowerCase().includes(search.value.toLowerCase()))
})

function select(entry) {
  model.value = false
  emit('select', entry)
}
</script>
