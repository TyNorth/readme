<template>
  <div class="timeline-container">
    <div
      v-for="story in sortedStories"
      :key="story.id"
      class="timeline-entry"
      @click="$emit('edit', story)"
    >
      <div class="timeline-dot" />
      <div class="timeline-card q-pa-md">
        <div class="text-subtitle2 text-gold">{{ story.title }}</div>
        <div class="text-caption text-grey-5 q-mb-sm">
          {{ story.summary || 'No summary yet...' }}
        </div>
        <div class="row q-gutter-xs q-mb-sm">
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
        </div>
        <q-badge :label="story.visibility" color="primary" class="text-capitalize" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'
const props = defineProps({
  stories: Array,
})
defineEmits(['edit'])

const sortedStories = computed(() =>
  [...(props.stories || [])].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
)
</script>

<style scoped>
.timeline-container {
  position: relative;
  margin-left: 20px;
  padding-left: 16px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
}

.timeline-entry {
  position: relative;
  margin-bottom: 2rem;
  cursor: pointer;
}

.timeline-dot {
  position: absolute;
  left: -12px;
  top: 10px;
  width: 14px;
  height: 14px;
  background-color: var(--q-primary);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 8px rgba(255, 215, 100, 0.3);
}

.timeline-card {
  background-color: #1e1f21;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
}
.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
</style>
