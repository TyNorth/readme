<template>
  <q-page class="q-pa-md">
    <DashboardHeader title="Story Overview" :subtitle="story?.title || 'Loading...'" />

    <q-card flat bordered class="bg-grey-9 text-white q-pa-md q-mb-lg">
      <ThemedInput v-model="story.title" label="Title" />
      <ThemedTextarea v-model="story.summary" label="Summary" />
      <ThemedSelect
        v-model="story.tags"
        label="Tags"
        multiple
        use-input
        new-value-mode="add-unique"
        :options="[]"
      />
      <q-select
        v-model="story.visibility"
        label="Visibility"
        filled
        dense
        :options="['draft', 'public']"
        class="q-mt-sm themed-input"
      />
    </q-card>

    <ThemedSection title="Chapters" icon="sym_o_library_books">
      <div v-if="chapters.length">
        <q-list separator>
          <q-item v-for="chapter in chapters" :key="chapter.id" clickable>
            <q-item-section>
              <q-item-label>{{ chapter.title }}</q-item-label>
              <q-item-label caption>Chapter {{ chapter.number }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat dense round icon="sym_o_edit" @click.stop="editChapter(chapter)" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div v-else class="q-pa-md text-center">
        <q-icon name="sym_o_library_books" size="32px" color="grey-5" class="q-mb-sm" />
        <div class="text-grey-5 q-mb-sm">No chapters yet</div>
        <q-btn
          color="primary"
          icon="sym_o_edit_document"
          label="Go to Chapters"
          @click="goToEditor"
        />
      </div>
    </ThemedSection>

    <ThemedSubmitBar label="Save Story" :loading="saving" @submit="save" :icon="`sym_o_save`" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/boot/supabase'
import DashboardHeader from '@/components/universe/dashboard/DashboardHeader.vue'
import ThemedInput from '@/elements/common/ThemedInput.vue'
import ThemedTextarea from '@/elements/common/ThemedTextarea.vue'
import ThemedSelect from '@/elements/common/ThemedSelect.vue'
import ThemedSection from '@/elements/common/ThemedSection.vue'
import ThemedSubmitBar from '@/elements/common/ThemedSubmitBar.vue'

const route = useRoute()
const router = useRouter()
const storyId = route.params.storyId

const story = ref({})
const chapters = ref([])
const saving = ref(false)

onMounted(async () => {
  const { data: s } = await supabase.from('stories').select('*').eq('id', storyId).single()
  story.value = s

  const { data: ch } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', storyId)
    .order('number', { ascending: true })

  chapters.value = ch || []
})

async function save() {
  saving.value = true
  try {
    await supabase
      .from('stories')
      .update({
        title: story.value.title,
        summary: story.value.summary,
        tags: story.value.tags,
        visibility: story.value.visibility,
      })
      .eq('id', storyId)
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

function editChapter(chapter) {
  router.push(`/editor/${story.value.id}?chapterId=${chapter.id}`)
}

function goToEditor() {
  router.push(`/editor/${storyId}`)
}
</script>
