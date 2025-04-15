<template>
  <q-card flat bordered class="bg-grey-10 text-white q-pa-md">
    <!-- Tags -->
    <div class="q-mb-sm">
      <div class="text-caption text-grey-5">Tags</div>
      <div class="row q-gutter-xs q-mt-xs">
        <q-chip
          v-for="tag in tags"
          :key="tag"
          dense
          color="primary"
          text-color="white"
          icon="sym_o_style"
        >
          {{ tag }}
        </q-chip>
      </div>
    </div>

    <!-- Visibility & Timestamps -->
    <div class="q-mt-md row q-col-gutter-md">
      <div class="col-6">
        <div class="text-caption text-grey-5">Visibility</div>
        <q-badge :label="visibility" color="primary" class="q-mt-xs" />
      </div>

      <div class="col-6">
        <div class="text-caption text-grey-5">Created</div>
        <div class="text-body2 q-mt-xs">{{ formatDate(createdAt) }}</div>
      </div>
    </div>

    <!-- Stats -->
    <div class="q-mt-md row q-col-gutter-md">
      <div class="col-4">
        <div class="text-caption text-grey-5">Stories</div>
        <div class="text-h6 text-gold">{{ storyCount }}</div>
      </div>
      <div class="col-4">
        <div class="text-caption text-grey-5">Characters</div>
        <div class="text-h6 text-gold">{{ characterCount }}</div>
      </div>
      <div class="col-4">
        <div class="text-caption text-grey-5">Lore</div>
        <div class="text-h6 text-gold">{{ loreCount }}</div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  tags: Array,
  visibility: String,
  createdAt: String,
  storyCount: Number,
  characterCount: Number,
  loreCount: Number,
})

function formatDate(date) {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
