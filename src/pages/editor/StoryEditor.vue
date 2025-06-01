<template>
  <q-page class="story-editor q-pa-xl">
    <InlineEditableText v-model="story.title" class="editor-title" :rules="[rules.required]" />

    <InlineEditableTextarea
      v-model="story.summary"
      label="Story Summary"
      class="editor-body q-mt-md"
    />

    <ThemedSection title="Chapters" icon="sym_o_library_books" class="q-mt-xl">
      <q-list separator>
        <q-item
          v-for="chapter in chapters"
          :key="chapter.id"
          clickable
          @click="goToChapter(chapter)"
        >
          <q-item-section>
            <q-item-label>{{ chapter.title }}</q-item-label>
            <q-item-label caption>Chapter {{ chapter.number }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat dense round icon="sym_o_edit" />
          </q-item-section>
        </q-item>
      </q-list>
    </ThemedSection>

    <CreateChapterDrawer
      v-model="chapterCreateOpen"
      :story-id="storyId"
      :creator-id="creatorId"
      @created="chapters.push($event)"
    />

    <q-btn
      fab
      icon="sym_o_add"
      color="primary"
      class="fixed-bottom-right q-ma-md z-top"
      @click="chapterCreateOpen = true"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/boot/supabase'

import InlineEditableText from '@/components/universe/dashboard/InlineEditableText.vue'
import InlineEditableTextarea from '@/components/universe/dashboard/InlineEditableTextarea.vue'
import ThemedSection from '@/elements/common/ThemedSection.vue'
import CreateChapterDrawer from '@/components/universe/dashboard/CreateChapterDrawer.vue'
import { useUserStore } from 'src/stores/user-store'

const route = useRoute()
const router = useRouter()
const storyId = route.params.storyId

const story = ref({ title: '', summary: '' })
const chapters = ref([])
const chapterCreateOpen = ref(false)
const auth = useUserStore()

const creatorId = ref(null)

onMounted(async () => {
  creatorId.value = auth.authUser.id
  console.log(creatorId.value)
  const { data: s } = await supabase.from('stories').select('*').eq('id', storyId).single()
  if (s) story.value = s

  const { data: ch } = await supabase
    .from('chapters')
    .select('*')
    .eq('story_id', storyId)
    .order('number', { ascending: true })

  chapters.value = ch || []
})

function goToChapter(chapter) {
  router.push(`/editor/${storyId}/chapter/${chapter.id}`)
}

const rules = {
  required: (val) => !!val || 'Required',
}
</script>

<style scoped>
.story-editor {
  max-width: 960px;
  margin: 0 auto;
  background: #141516;
  color: white;
}
.editor-title {
  font-size: 2.2rem;
  font-family: 'Spectral', serif;
  font-weight: bold;
  color: #c49a43;
}
.editor-body {
  font-family: 'Open Sans', serif;
  font-size: 1.05rem;
  line-height: 1.6;
}
</style>
