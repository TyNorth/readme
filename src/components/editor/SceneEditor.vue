<template>
  <q-card flat bordered class="bg-grey-10 text-white q-pa-md rounded-borders">
    <EditorToolbar @action="handleToolbarAction">
      <q-btn dense flat icon="sym_o_check_circle" label="Save" @click="$emit('save')" />
    </EditorToolbar>

    <EditorMarkdown v-model:text="content" class="q-mb-md" />

    <q-separator spaced />

    <div class="q-mt-md">
      <q-input v-model="voiceUrl" label="Voice Audio URL" filled dense />
      <StoryPlayback :audio-url="voiceUrl" class="q-mt-sm" />
    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import EditorToolbar from './EditorToolbar.vue'
import EditorMarkdown from './EditorMarkdown.vue'
import StoryPlayback from '@/components/story/StoryPlayback.vue'

const content = ref('')
const voiceUrl = ref('')

defineEmits(['save'])

function handleToolbarAction(action) {
  // Example: add markdown shortcuts or tags
  console.log('toolbar action:', action)
}
</script>
