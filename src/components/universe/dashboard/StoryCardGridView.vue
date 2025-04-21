<template>
  <div class="row q-col-gutter-md q-gutter-md">
    <div v-for="story in stories" :key="story.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
      <q-card
        flat
        bordered
        class="story-card bg-grey-9 text-white cursor-pointer"
        @click="$emit('edit', story)"
      >
        <q-card-section>
          <div class="text-subtitle2 text-gold q-mb-xs">{{ story.title }}</div>
          <div class="text-caption text-grey-5 ellipsis-2-lines">
            {{ story.summary || 'No summary yet...' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none row q-gutter-xs">
          <q-chip
            v-for="tag in story.tags || []"
            :key="tag"
            dense
            size="sm"
            color="primary"
            text-color="white"
            icon="sym_o_style"
          >
            {{ tag }}
          </q-chip>
        </q-card-section>

        <q-separator spaced />

        <q-card-actions align="between">
          <q-badge :label="story.visibility" color="primary" class="text-capitalize" />
          <q-btn flat dense icon="sym_o_edit" size="sm" @click.stop="$emit('edit', story)" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stories: Array,
})
defineEmits(['edit'])
</script>

<style scoped>
.story-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
}
.story-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
</style>
