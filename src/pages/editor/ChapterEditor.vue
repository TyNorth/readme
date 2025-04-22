<template>
  <q-page class="chapter-editor">
    <!-- Header -->
    <div class="editor-header row items-center justify-between q-pa-md" v-if="!isImmersive">
      <div>
        <div class="text-caption text-grey-5">Story</div>
        <div class="text-h6 text-gold">{{ story?.title || 'Loading...' }}</div>
      </div>
      <q-btn
        flat
        dense
        icon="sym_o_fullscreen"
        color="primary"
        @click="isImmersive = !isImmersive"
      />
    </div>

    <!-- Chapter Title -->
    <div class="q-pa-md">
      <InlineEditableText v-model="chapter.title" class="editor-title" :rules="[rules.required]" />
    </div>

    <!-- Writing Pad -->
    <div class="editor-container q-px-md q-pb-xl">
      <InlineEditableTextarea
        v-model="chapter.text"
        label="Write your story..."
        :autogrow="false"
        filled
        class="editor-content"
        @save="manualSave"
      />
    </div>

    <!-- Save Info -->
    <div v-if="!isImmersive" class="text-caption text-grey-5 q-px-md q-pb-md">
      <q-icon name="sym_o_save" class="q-mr-xs" />
      Last saved {{ formattedUpdatedAt }}
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/boot/supabase'
import { debounce } from 'lodash-es'

import InlineEditableText from '@/components/universe/dashboard/InlineEditableText.vue'
import InlineEditableTextarea from '@/components/universe/dashboard/InlineEditableTextarea.vue'
import { notifySuccess } from 'src/utils/notify'

const route = useRoute()
const storyId = route.params.storyId
const chapterId = route.params.chapterId

const story = ref(null)
const chapter = ref({ title: '', text: '' })
const isImmersive = ref(false)

const rules = {
  required: (val) => !!val || 'Required',
}

const formattedUpdatedAt = computed(() => {
  if (!chapter.value.updated_at) return '...'
  return new Date(chapter.value.updated_at).toLocaleTimeString()
})

// 🔁 Save to Supabase and update local state
async function manualSave() {
  if (!chapter.value.id) return

  const { data, error } = await supabase
    .from('chapters')
    .update({
      title: chapter.value.title,
      text: chapter.value.text,
    })
    .eq('id', chapterId)
    .select()

  if (data && data.length) {
    chapter.value = data[0] // Update local state including updated_at
    notifySuccess(`Last saved at ${new Date().toLocaleTimeString()}`)
  }

  if (error) {
    console.error('Manual Save Error:', error)
  }
}

// ⌨ Hotkeys
function handleKeydown(e) {
  switch (e.key) {
    case 'Escape':
      isImmersive.value = false
      break
    case 's':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        manualSave()
      }
      break
    case 'i':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        isImmersive.value = !isImmersive.value
      }
      break
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)

  const { data: s } = await supabase.from('stories').select('title').eq('id', storyId).single()

  story.value = s

  const { data: c } = await supabase.from('chapters').select('*').eq('id', chapterId).single()

  chapter.value = c
})

// Debounced auto-save
const autoSave = debounce(async () => {
  if (!chapter.value.id) return

  const { data, error } = await supabase
    .from('chapters')
    .update({
      title: chapter.value.title,
      text: chapter.value.text,
    })
    .eq('id', chapterId)
    .select()

  if (data && data.length) {
    chapter.value = data[0] // Update local state including updated_at
    notifySuccess(`Last saved at ${new Date().toLocaleTimeString()}`)
  }

  if (error) {
    console.error('Auto Save Error:', error)
  }
}, 5000)

// Watchers
watch(
  () => chapter.value.title,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      autoSave()
    }
  },
)

watch(
  () => chapter.value.text,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      autoSave()
    }
  },
)
</script>

<style scoped>
.chapter-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #141516;
  color: white;
}

.editor-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.editor-title {
  font-size: 2.2rem;
  font-family: 'Spectral', serif;
  font-weight: bold;
  color: #c49a43;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-content {
  flex: 1;
  width: 100%;
  height: 100%;
  font-family: 'Open Sans', serif;
  font-size: 1.1rem;
  line-height: 1.7;
  background-color: #1b1c1e;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 0 8px rgba(255, 215, 100, 0.05);
}

.editor-content :deep(.q-field__control) {
  min-height: 60vh;
  background-color: transparent;
  border: none;
  box-shadow: none;
}
</style>
