<template>
  <q-page :class="$q.dark.isActive ? 'q-pa-md text-white' : 'q-pa-md bg-light text-black'">
    <!-- Banner + Title -->
    <div v-if="universe" class="q-mb-lg">
      <q-img
        v-if="bannerUrl"
        :src="bannerUrl"
        class="rounded-borders q-mb-md"
        style="max-height: 250px; object-fit: cover"
      />

      <div class="text-h4 text-gold">{{ universe.title }}</div>
      <div class="text-caption" :class="$q.dark.isActive ? 'text-white' : 'text-black'">
        {{ universe.summary }}
      </div>

      <div class="q-mt-sm row q-gutter-xs">
        <q-chip
          v-for="tag in universe.tags"
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
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="activeTab"
      class="q-mt-lg"
      :class="$q.dark.isActive ? 'text-white' : 'text-black'"
      active-color="gold"
      indicator-color="primary"
      narrow-indicator
      align="left"
    >
      <q-tab name="about" label="About" icon="sym_o_info" />
      <q-tab name="stories" label="Stories" icon="sym_o_menu_book" />
      <q-tab name="lore" label="Lore" icon="sym_o_auto_stories" />
      <q-tab name="characters" label="Characters" icon="sym_o_face" />
    </q-tabs>

    <q-separator spaced />

    <!-- Tab Panels -->
    <div v-show="activeTab === 'about'" class="q-mt-md">
      <div class="text-body1" :class="$q.dark.isActive ? 'text-white' : 'text-black'">
        {{ universe?.about || 'This universe is still unfolding.' }}
      </div>
    </div>

    <div v-show="activeTab === 'stories'" class="q-mt-md">
      <div v-if="stories.length" class="q-gutter-sm row q-col-gutter-xs">
        <div class="col-sm-4 col-md-3 col-lg-3" v-for="story in stories" :key="story.id">
          <SceneCard
            :title="story.title"
            :summary="story.description"
            :tags="story.tags || ['action']"
            @click="$router.push(`/read/${story.id}`)"
          />
        </div>
      </div>
      <div v-else class="text-caption text-grey-5">No stories available yet.</div>
    </div>

    <div v-show="activeTab === 'lore'" class="row q-gutter-md col-12 col-sm-6 col-md-4 col-lg-3">
      <LoreEntry
        v-for="entry in lore"
        :key="entry.id"
        :title="entry.title"
        :summary="entry.summary"
        :icon="entry.type || 'auto_stories'"
        @click="handleLoreSelection(entry)"
        style="max-width: 300px"
      />
      <LorePopup
        v-model="selectedLore"
        v-if="selectedLore"
        :title="selectedLore.title"
        :content="selectedLore.content"
      />
    </div>

    <div v-show="activeTab === 'characters'" class="flex row q-gutter-lg q-col-gutter-md">
      <CharacterCard
        v-for="char in characters"
        :key="char.id"
        :name="char.name"
        :alias="char.alias"
        :portrait="char.portrait_url"
        :tags="char.tags"
        :bio="char.bio"
        :role="char.role_rank || 'None'"
        @click="handleCharacterSelection(char)"
        class="col-4 col-sm-6 col-md-4 col-lg-3"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { supabase } from '@/boot/supabase'
import { getUniverseBannerUrl } from '@/supabase/universeBanners'
import SceneCard from '@/components/story/SceneCard.vue'
import LoreEntry from '@/components/lore/LoreEntry.vue'
import LorePopup from '@/components/lore/LorePopup.vue'
import CharacterCard from '@/components/character/CharacterCard.vue'

const route = useRoute()
const router = useRouter()
const universeId = route.params.id

const universe = ref(null)
const bannerUrl = ref('')
const stories = ref([])
const lore = ref([])
const characters = ref([])

const activeTab = ref('about')
const selectedLore = ref(null)

const handleCharacterSelection = (char) => {
  // insert nagivation here
  router.push(`/universe/${universeId}/character/${char.id}`)
}
const handleLoreSelection = (lore) => {
  // insert nagivation here
  router.push(`/universe/${universeId}/lore/${lore.id}`)
}

onMounted(async () => {
  const { data: u } = await supabase.from('universes').select('*').eq('id', universeId).single()
  universe.value = u

  // Load banner from storage
  bannerUrl.value = await getUniverseBannerUrl(universeId)
  console.log(bannerUrl.value)

  const { data: s } = await supabase
    .from('stories')
    .select('*')
    .eq('universe_id', universeId)
    .eq('visibility', 'public')
  stories.value = s || []

  // console.log(`stories: ${JSON.stringify(stories.value)}`)

  const { data: l } = await supabase.from('lore_entries').select('*').eq('universe_id', universeId)
  lore.value = l || []

  const { data: c } = await supabase
    .from('characters')
    .select('*')
    .eq('universe_id', 'a1a1a1a1-a1a1-4a1a-a1a1-a1a1a1a1a1a1')
  characters.value = c || []
})
</script>
