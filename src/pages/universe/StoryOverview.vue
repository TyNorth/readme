<template>
  <q-page class="q-pa-md">
    <DashboardHeader
      :title="story?.title ? 'Story Overview: ' + story.title : 'Loading Story...'"
    />

    <q-card flat bordered class="bg-grey-9 text-white q-pa-md q-mb-lg">
      <ThemedInput
        v-model="story.title"
        label="Title"
        :rules="[(val) => !!val || 'Title is required']"
      />
      <ThemedTextarea v-model="story.summary" label="Summary" />
      <ThemedSelect
        v-model="story.tags"
        label="Tags"
        multiple
        use-input
        use-chips
        new-value-mode="add-unique"
        :options="[]"
        hint="Press Enter to add a new tag"
      />
      <q-select
        v-model="story.visibility"
        label="Visibility"
        filled
        dense
        :options="['draft', 'public', 'private', 'unlisted']"
        class="q-mt-sm themed-input"
        :dark="$q.dark.isActive"
      />
    </q-card>

    <ThemedSection title="Chapters" icon="sym_o_library_books">
      <div v-if="chapters.length > 0">
        <q-list separator :dark="$q.dark.isActive">
          <q-item v-for="chapter in chapters" :key="chapter.id" clickable>
            <q-item-section @click="editChapter(chapter)">
              <q-item-label>{{ chapter.title || 'Untitled Chapter' }}</q-item-label>
              <q-item-label caption :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'">
                Chapter {{ chapter.number || 'N/A' }}
                <span v-if="chapter.summary" class="q-ml-sm text-italic ellipsis"
                  >- {{ chapter.summary }}</span
                >
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                color="primary"
                flat
                dense
                round
                icon="sym_o_edit"
                @click.stop="editChapter(chapter)"
                aria-label="Edit Chapter"
              >
                <q-tooltip :delay="500">Edit Chapter</q-tooltip>
              </q-btn>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color="negative"
                flat
                dense
                round
                icon="sym_o_delete"
                @click.stop="confirmDeleteChapter(chapter)"
                aria-label="Delete Chapter"
              >
                <q-tooltip :delay="500">Delete Chapter</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div v-else class="q-pa-md text-center">
        <q-icon name="sym_o_library_books" size="32px" color="grey-5" class="q-mb-sm" />
        <div class="text-grey-5 q-mb-sm">No chapters yet for this story.</div>
        <q-btn
          color="primary"
          icon="sym_o_edit_document"
          label="Go to Story Editor to Add Chapters"
          @click="goToEditor"
        />
      </div>
    </ThemedSection>

    <ThemedSubmitBar
      label="Save Story Details"
      :loading="saving"
      @submit="saveStoryDetails"
      icon="sym_o_save"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/boot/supabase'
import { useQuasar, Notify } from 'quasar' // Import useQuasar and Notify

import DashboardHeader from '@/components/universe/dashboard/DashboardHeader.vue'
import ThemedInput from '@/elements/common/ThemedInput.vue'
import ThemedTextarea from '@/elements/common/ThemedTextarea.vue'
import ThemedSelect from '@/elements/common/ThemedSelect.vue'
import ThemedSection from '@/elements/common/ThemedSection.vue'
import ThemedSubmitBar from '@/elements/common/ThemedSubmitBar.vue'

const $q = useQuasar() // For Dialog plugin
const route = useRoute()
const router = useRouter()
const storyId = route.params.storyId

const story = ref({})
const chapters = ref([])
const saving = ref(false) // For saving story details
const deletingChapterId = ref(null) // To show loading on specific delete action if needed

onMounted(async () => {
  // Fetch story details
  const { data: storyData, error: storyError } = await supabase
    .from('stories')
    .select('*')
    .eq('id', storyId)
    .single()

  if (storyError) {
    console.error('Error fetching story:', storyError)
    Notify.create({ type: 'negative', message: `Failed to load story: ${storyError.message}` })
    // Optionally redirect or show error state
    story.value = { title: 'Error Loading Story' } // Placeholder
  } else {
    story.value = storyData || {} // Ensure story.value is an object
  }

  // Fetch chapters for this story
  const { data: chaptersData, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', storyId)
    .order('number', { ascending: true })

  if (chaptersError) {
    console.error('Error fetching chapters:', chaptersError)
    Notify.create({
      type: 'negative',
      message: `Failed to load chapters: ${chaptersError.message}`,
    })
  } else {
    chapters.value = chaptersData || []
  }
})

async function saveStoryDetails() {
  saving.value = true
  try {
    const updates = {
      title: story.value.title,
      summary: story.value.summary,
      tags: story.value.tags,
      visibility: story.value.visibility,
      // updated_at will be handled by Supabase
    }
    const { error } = await supabase.from('stories').update(updates).eq('id', storyId)

    if (error) {
      throw error
    }
    Notify.create({ type: 'positive', message: 'Story details saved successfully!' })
  } catch (err) {
    console.error('Error saving story details:', err)
    Notify.create({ type: 'negative', message: `Failed to save story: ${err.message}` })
  } finally {
    saving.value = false
  }
}

function editChapter(chapter) {
  // Ensure story.value.id is available, though storyId from route params is more direct
  router.push(`/editor/${storyId}/chapter/${chapter.id}`)
}

function goToEditor() {
  router.push(`/editor/${storyId}`)
}

// --- New Delete Chapter Logic ---
function confirmDeleteChapter(chapter) {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete the chapter "${chapter.title || 'Untitled Chapter'}"? This action cannot be undone.`,
    cancel: { label: 'Cancel', flat: true, class: $q.dark.isActive ? 'text-white' : '' },
    ok: { label: 'Delete', color: 'negative', flat: false },
    dark: $q.dark.isActive, // Match current theme
    persistent: true,
    class: 'flat',
  }).onOk(async () => {
    await deleteChapter(chapter.id, chapter.title)
  })
}

async function deleteChapter(chapterId, chapterTitle) {
  deletingChapterId.value = chapterId // For potential specific loading state on the button
  try {
    const { error } = await supabase.from('chapters').delete().eq('id', chapterId)

    if (error) {
      throw error
    }

    // Remove chapter from local array
    chapters.value = chapters.value.filter((ch) => ch.id !== chapterId)
    Notify.create({
      type: 'positive',
      message: `Chapter "${chapterTitle || 'Untitled Chapter'}" deleted successfully.`,
    })
  } catch (err) {
    console.error('Error deleting chapter:', err)
    Notify.create({ type: 'negative', message: `Failed to delete chapter: ${err.message}` })
  } finally {
    deletingChapterId.value = null
  }
}
</script>

<style scoped>
/* Add specific styles if needed */
.text-gold {
  color: #c49a43; /* Or your theme's gold color */
}
.q-item__label--caption .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
