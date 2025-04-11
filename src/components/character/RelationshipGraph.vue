<template>
  <q-card flat class="bg-grey-10 text-white q-pa-md rounded-borders">
    <div class="text-h6 q-mb-md">Relationships</div>
    <div class="text-caption text-grey-5 q-mb-sm">
      (Graph layout coming soon: mentor, ally, rival, unknown)
    </div>

    <q-list>
      <q-item v-for="rel in relationships" :key="rel.target">
        <q-item-section avatar>
          <q-icon :name="iconMap[rel.type] || 'sym_o_question_mark'" />
        </q-item-section>
        <q-item-section> {{ rel.type }} → {{ rel.target }} </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup>
defineProps({
  relationships: {
    type: Array,
    default: () => [],
  },
})

const iconMap = {
  mentor: 'sym_o_school',
  ally: 'sym_o_handshake',
  rival: 'sym_o_swords',
  enemy: 'sym_o_warning',
  unknown: 'sym_o_help',
}
</script>
