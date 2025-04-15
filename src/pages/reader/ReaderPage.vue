<template>
  <q-page class="q-pa-md bg-dark-page text-white">
    <div v-if="chapter" class="q-mb-lg">
      <!-- Header Controls -->
      <div class="row items-center q-mb-sm q-gutter-md">
        <div class="text-h5 text-shimmer">{{ chapter.title }}</div>

        <q-btn-toggle
          v-model="viewMode"
          :options="[
            { label: 'Narrative', value: 'text' },
            { label: 'Audio Scene', value: 'audio' },
          ]"
          class="q-ml-auto text-subtitle1"
          :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-9'"
          toggle-color="primary"
          unelevated
          dark
        />

        <q-btn
          v-if="false"
          icon="sym_o_tune"
          round
          dense
          color="primary"
          @click="optionsOpen = true"
        />

        <ReaderOptionsDialog v-model="optionsOpen" />
      </div>

      <!-- Summary -->
      <div
        :class="[
          'text-subtitle1 text-italic q-mb-md',
          $q.dark.isActive ? 'text-grey-5' : 'text-grey-9',
        ]"
      >
        {{ chapter.summary }}
      </div>

      <!-- Narrative Text View -->
      <q-card v-if="viewMode === 'text'" flat class="q-pa-md q-mb-xl" :class="narrativeClasses">
        <div style="white-space: pre-line">
          {{ chapter.text }}
        </div>
      </q-card>

      <!-- Audio Scene View -->
      <ScenePlayback
        v-else
        :lines="chapterLines"
        :characters="characters"
        :chapter-id="chapter.id"
        :story-id="storyId"
      />

      <!-- Next Chapter -->
      <NextChapterCard v-if="nextChapter" :next-chapter="nextChapter" @next="loadChapterById" />
    </div>

    <!-- Loading State -->
    <div v-else class="q-pa-xl flex flex-center">
      <q-spinner size="30px" color="primary" />
    </div>

    <!-- Floating Chapter Nav -->
    <ChapterNavFAB
      v-if="allChapters.length > 1"
      :chapters="allChapters"
      :current-chapter-id="chapter?.id"
      @select="loadChapterById"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/boot/supabase'
import ScenePlayback from '@/components/story/ScenePlayback.vue'
import ChapterNavFAB from '@/components/story/ChapterNavFAB.vue'
import NextChapterCard from '@/components/story/NextChapterCard.vue'
import { getChaptersByStory } from '@/supabase/chapters'
import { getStory } from '@/supabase/stories'
import { getCharacters } from '@/supabase/characters'
import { useReaderOptionsStore } from 'src/stores/reader-options-store'
import ReaderOptionsDialog from '@/components/reader/ReaderOptionsDialog.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const optionsOpen = ref(false)

const route = useRoute()
const storyId = route.params.storyId

const readerOptionsStore = useReaderOptionsStore()
const narrativeClasses = computed(() => [
  `font-${readerOptionsStore.fontSize}`,
  `font-${readerOptionsStore.fontFamily}`,
  `lh-${readerOptionsStore.lineHeight}`,
  readerOptionsStore.highContrast ? 'contrast-high' : '',
  readerOptionsStore.theme === 'light' ? 'theme-light' : 'theme-dark',
  $q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3 text-black',
])

const chapter = ref(null)
const chapterLines = ref([])
const characters = ref([])
const allChapters = ref([])
const viewMode = ref('text')

const nextChapter = computed(() => {
  const currentIndex = allChapters.value.findIndex((c) => c.id === chapter.value?.id)
  return currentIndex >= 0 && currentIndex < allChapters.value.length - 1
    ? allChapters.value[currentIndex + 1]
    : null
})

watch(
  () => ({
    fontSize: readerOptionsStore.fontSize,
    fontFamily: readerOptionsStore.fontFamily,
    lineHeight: readerOptionsStore.lineHeight,
    audioSpeed: readerOptionsStore.audioSpeed,
    highContrast: readerOptionsStore.highContrast,
    immersionMode: readerOptionsStore.immersionMode,
    theme: readerOptionsStore.theme,
  }),
  () => readerOptionsStore.persist(),
  () => readerOptionsStore.loadFromStorage(),
  { deep: true },
)

onMounted(async () => {
  const story = await getStory(storyId)
  allChapters.value = await getChaptersByStory(storyId)

  // Load last read chapter or default to first
  const lastId = localStorage.getItem(`story:${storyId}:lastChapter`)
  const matched = allChapters.value.find((c) => c.id === lastId)
  const defaultChapter = matched || allChapters.value[0]
  await loadChapterById(defaultChapter.id)

  characters.value = await getCharacters(story.universe_id)

  readerOptionsStore.loadFromStorage()
})

async function loadChapterById(id) {
  chapter.value = allChapters.value.find((c) => c.id === id)

  const { data: lines } = await supabase
    .from('chapter_lines')
    .select('*')
    .eq('chapter_id', id)
    .order('order_index', { ascending: true })

  chapterLines.value = lines || []

  // Save progress
  localStorage.setItem(`story:${storyId}:lastChapter`, id)
}
</script>

<style>
.reader-wrapper {
  transition: all 0.3s ease;
}

.font-sm {
  font-size: 0.85rem;
}
.font-md {
  font-size: 1rem;
}
.font-lg {
  font-size: 1.25rem;
}
.font-xl {
  font-size: 1.5rem;
}

.font-serif {
  font-family: 'Spectral', serif;
}
.font-sans {
  font-family: 'Open Sans', sans-serif;
}

.lh-normal {
  line-height: 1.5;
}
.lh-relaxed {
  line-height: 1.75;
}
.lh-loose {
  line-height: 2;
}

.contrast-high {
  color: #ffffff !important;
  background-color: #000000 !important;
}

.theme-light {
  background-color: #fdfdfc;
  color: #111;
}

.theme-dark {
  background-color: #121212;
  color: #eaeaea;
}
</style>
