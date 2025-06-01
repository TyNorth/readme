<template>
  <q-page
    class="chapter-editor"
    :class="$q.dark.isActive ? 'bg-dark-page text-white' : 'bg-light-page text-black'"
  >
    <div v-if="isLoading" class="flex flex-center" style="height: calc(100vh - 100px)">
      <q-spinner-puff color="primary" size="3em" />
      <div class="q-ml-md text-h6">Loading Chapter...</div>
    </div>
    <div v-else-if="fetchError" class="flex flex-center column" style="height: calc(100vh - 100px)">
      <q-icon name="sym_o_error_outline" color="negative" size="3em" />
      <div class="q-mt-md text-h6 text-negative">Failed to load chapter data.</div>
      <div class="text-caption q-mt-sm">{{ fetchError }}</div>
      <q-btn label="Go Back" color="primary" @click="goBackToList" class="q-mt-lg" />
    </div>

    <template v-else-if="chapter && story">
      <div class="editor-header row items-center justify-between q-pa-md" v-if="!isImmersive">
        <div>
          <div class="text-caption text-grey-5">Story</div>
          <div class="text-h6 text-gold">{{ story.title || 'Story Title' }}</div>
        </div>
        <q-btn
          flat
          dense
          icon="sym_o_fullscreen"
          :color="$q.dark.isActive ? 'white' : 'primary'"
          @click="isImmersive = !isImmersive"
          aria-label="Toggle Immersive Mode"
        />
      </div>

      <div class="q-pa-md">
        <InlineEditableText
          v-model="chapter.title"
          class="editor-title"
          :rules="[rules.required]"
          placeholder="Chapter Title"
        />
      </div>

      <div>
        <InlineEditableText
          v-model="chapter.number"
          class="editor-title"
          :rules="[rules.required]"
          placeholder="Chapter Number"
        />
      </div>

      <div class="editor-container q-px-md q-pb-xl">
        <InlineEditableTextarea
          v-model="chapter.text"
          label="Write your story..."
          :autogrow="false"
          filled
          class="editor-content"
          :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-2'"
          placeholder="Once upon a time..."
          @save="manualSave"
        />
      </div>

      <div v-if="!isImmersive" class="text-caption text-grey-5 q-px-md q-pb-md row items-center">
        <q-icon name="sym_o_save" class="q-mr-xs" />
        <span v-if="isSaving" class="row items-center">
          <q-spinner-dots size="1em" color="primary" class="q-mr-xs" /> Saving...
        </span>
        <span v-else> Last saved: {{ formattedUpdatedAt }} </span>
      </div>
    </template>
    <div v-else class="flex flex-center" style="height: 80vh">
      <q-icon name="sym_o_warning" color="warning" size="3em" />
      <div class="q-ml-md text-h6">Chapter or Story data not found.</div>
      <q-btn label="Go Back" color="primary" @click="goBackToList" class="q-mt-lg" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/boot/supabase'
import { debounce, Notify, useQuasar } from 'quasar'

import InlineEditableText from '@/components/universe/dashboard/InlineEditableText.vue'
import InlineEditableTextarea from '@/components/universe/dashboard/InlineEditableTextarea.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const storyId = route.params.storyId
const chapterId = route.params.chapterId

const story = ref(null)
const chapter = ref(null)
const isImmersive = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)
const fetchError = ref(null)

const rules = {
  required: (val) => (val !== null && val !== undefined && val !== '') || 'Required',
  isNumberOrNull: (val) => {
    if (val === null || val === '' || val === undefined) return true // Allow empty/null
    return (!isNaN(parseFloat(val)) && isFinite(val)) || 'Must be a number'
  },
}

const formattedUpdatedAt = computed(() => {
  if (!chapter.value?.updated_at) return 'Not saved yet'
  try {
    return new Date(chapter.value.updated_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch (e) {
    console.error(e)
    return 'Invalid date'
  }
})

async function saveData(payloadToSave) {
  if (!chapter.value?.id) {
    console.warn('Save attempt with no chapter ID.')
    return false
  }
  isSaving.value = true
  let success = false
  try {
    const processedPayload = { ...payloadToSave }

    // Process chapter number to ensure it's an integer or null
    if (Object.prototype.hasOwnProperty.call(processedPayload, 'number')) {
      const numVal = processedPayload.number
      if (numVal === '' || numVal === null || numVal === undefined) {
        processedPayload.number = null // Ensure empty input becomes null for the DB
      } else {
        const parsedNum = parseInt(numVal, 10)
        if (!isNaN(parsedNum)) {
          processedPayload.number = parsedNum
        } else {
          // If it's not a valid number and not empty, it's an error for an integer field
          Notify.create({
            type: 'negative',
            message: 'Chapter number is invalid. Number not saved.',
          })
          delete processedPayload.number // Don't send invalid number string
        }
      }
    }

    if (Object.keys(processedPayload).length === 0) {
      // console.log("No valid data to save.");
      isSaving.value = false
      return false // Or true if you consider "nothing to save" a success
    }

    const { data, error } = await supabase
      .from('chapters')
      .update(processedPayload)
      .eq('id', chapterId)
      .select()
      .single()

    if (error) {
      console.error('Save Error:', error)
      Notify.create({ type: 'negative', message: `Save failed: ${error.message}` })
      throw error // Re-throw to be caught by individual save functions if needed
    }

    if (data) {
      chapter.value = { ...chapter.value, ...data } // Update local chapter with returned data
      success = true
    } else {
      console.warn('Save operation returned no data, but no explicit error from Supabase.')
    }
  } catch (err) {
    // Error already notified if from Supabase specific error
    // This catch is for other potential errors in the try block
    console.error('Caught in saveData:', err)
  } finally {
    isSaving.value = false
  }
  return success
}

const debouncedAutoSave = debounce(async () => {
  if (!chapter.value || !chapter.value.id) return
  // console.log("Debounced auto-save triggered...");
  const success = await saveData({
    title: chapter.value.title,
    text: chapter.value.text,
    number: chapter.value.number, // Include number in auto-save
  })
  if (success) {
    Notify.create({
      type: 'positive',
      message: `Auto-saved at ${formattedUpdatedAt.value}`,
      position: 'bottom-right',
      timeout: 1500,
      classes: 'glossy',
    })
  }
}, 2500)

async function manualSave() {
  if (!chapter.value || !chapter.value.id) return
  // console.log("Manual save triggered...");
  const success = await saveData({
    title: chapter.value.title,
    text: chapter.value.text,
    number: chapter.value.number, // Include number in manual save
  })
  if (success) {
    Notify.create({
      type: 'positive',
      message: `Chapter saved! (${formattedUpdatedAt.value})`,
      icon: 'sym_o_check_circle',
    })
  }
}

function handleKeydown(e) {
  switch (e.key) {
    case 'Escape':
      if (isImmersive.value) {
        isImmersive.value = false
        e.preventDefault()
      }
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

function goBackToList() {
  if (story.value?.universe_id && story.value?.id) {
    // Check if universe_id is available on story object
    router.push(`/universe/${story.value.universe_id}/stories/${story.value.id}/overview`)
  } else if (story.value?.id) {
    router.push(`/editor/${story.value.id}`)
  } else {
    router.push('/')
  }
}

onMounted(async () => {
  // ... (existing onMounted data fetching logic remains the same) ...
  isLoading.value = true
  fetchError.value = null
  window.addEventListener('keydown', handleKeydown)
  try {
    const { data: storyData, error: storyError } = await supabase
      .from('stories')
      .select('id, title, universe_id')
      .eq('id', storyId)
      .single()

    if (storyError) throw storyError
    if (!storyData) throw new Error('Story not found.')
    story.value = storyData

    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single()

    if (chapterError) throw chapterError
    if (!chapterData) throw new Error('Chapter not found.')
    chapter.value = chapterData
  } catch (err) {
    console.error('Error fetching editor data:', err)
    fetchError.value = err.message || 'An unknown error occurred while loading data.'
    Notify.create({ type: 'negative', message: fetchError.value })
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (debouncedAutoSave && debouncedAutoSave.cancel) {
    debouncedAutoSave.cancel()
  }
})

// Watchers for auto-save
watch(
  () => chapter.value?.title,
  (newVal, oldVal) => {
    if (newVal !== oldVal && chapter.value?.id && !isLoading.value && !isSaving.value) {
      debouncedAutoSave()
    }
  },
) // Removed deep:true as it's not needed for a string primitive

watch(
  () => chapter.value?.text,
  (newVal, oldVal) => {
    if (newVal !== oldVal && chapter.value?.id && !isLoading.value && !isSaving.value) {
      debouncedAutoSave()
    }
  },
) // Removed deep:true as it's not needed for a string primitive

// *** ADDED WATCHER FOR CHAPTER NUMBER ***
watch(
  () => chapter.value?.number,
  (newVal, oldVal) => {
    // Compare as strings if newVal could be string from input, or ensure types match
    // Or parse newVal to number before comparison if chapter.number is always number
    if (
      String(newVal) !== String(oldVal) &&
      chapter.value?.id &&
      !isLoading.value &&
      !isSaving.value
    ) {
      debouncedAutoSave()
    }
  },
) // Removed deep:true
</script>

<style scoped>
.chapter-editor {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Changed from height to min-height for flexibility */
  /*
  The following lines make the editor ALWAYS dark.
  Remove them if you want it to follow the global Quasar dark/light theme
  which is applied by the :class on q-page.
  */
  /*
  background-color: #141516;
  color: white;
  */
}

/* Added classes for dynamic theme compatibility (examples) */
.bg-dark-page {
  background-color: #141516;
}
.bg-light-page {
  background-color: #f5f5f5;
} /* Or your light theme page background */

.editor-header {
  border-bottom: 1px solid rgba(var(--q-primary-rgb, 0, 0, 0), 0.12); /* Use theme color */
}
.dark .editor-header {
  /* Example for dark mode if needed and not covered by q-page class */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-title :deep(.q-field__input) {
  /* Target inner input for styling */
  font-size: 2.2rem !important;
  font-family: 'Spectral', serif;
  font-weight: bold;
  color: var(--q-text-gold, #c49a43); /* Use CSS var for gold or fallback */
}
.editor-number :deep(.q-field__input) {
  /* Target inner input for styling */
  font-size: 2.2rem !important;
  font-family: 'Spectral', serif;
  font-weight: bold;
  color: var(--q-text-gold, #c49a43); /* Use CSS var for gold or fallback */
}
.dark .editor-title :deep(.q-field__input) {
  color: var(--q-text-gold-dark, #e0b469); /* Slightly different gold for dark if needed */
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* height: 100%; Removed, flex:1 handles it */
}

.editor-content {
  flex: 1;
  width: 100%;
  /* height: 100%; Removed, flex:1 handles it */
  font-family: 'Open Sans', serif;
  font-size: 1.1rem;
  line-height: 1.7;
  border-radius: 8px;
  padding: 1.25rem;
  /* background-color and box-shadow handled by dynamic class and Quasar's theme */
}

.editor-content :deep(.q-field__control) {
  min-height: calc(100vh - 300px); /* Adjust based on header/footer/title height */
  background-color: transparent !important; /* Ensure transparency */
  border: none !important;
  box-shadow: none !important;
}

/* Define text-gold for use in template */
.text-gold {
  color: var(--q-text-gold, #c49a43);
}
.dark .text-gold {
  color: var(--q-text-gold-dark, #e0b469);
}
</style>
