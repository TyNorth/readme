<template>
  <q-page
    :class="[
      $q.dark.isActive ? 'q-pa-md text-white' : 'q-pa-md bg-light text-black',
      pageLoaded ? 'page-loaded' : '',
    ]"
  >
    <div v-if="isLoading" class="loading-overlay flex flex-center">
      <q-spinner-puff color="primary" size="3em" />
      <div class="q-ml-md text-subtitle1">Loading Universe...</div>
    </div>

    <template v-else-if="universe">
      <transition
        appear
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp"
      >
        <div class="q-mb-lg">
          <q-img
            v-if="bannerUrl"
            :src="bannerUrl"
            class="rounded-borders q-mb-md banner-image"
            style="max-height: 280px; object-fit: cover; width: 100%"
            spinner-color="primary"
          />
          <div
            v-else
            class="rounded-borders q-mb-md banner-placeholder bg-grey-8"
            style="height: 280px; width: 100%"
          ></div>

          <div class="text-h4 text-gold q-mt-md">{{ universe.title || 'Universe Title' }}</div>
          <div
            class="text-caption q-mt-xs"
            :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'"
          >
            {{ universe.summary || 'No summary available for this universe.' }}
          </div>

          <div class="q-mt-md row q-gutter-xs">
            <transition-group
              appear
              enter-active-class="animated zoomIn"
              leave-active-class="animated zoomOut"
            >
              <q-chip
                v-for="(tag, index) in universe.tags"
                :key="tag"
                dense
                size="sm"
                color="primary"
                text-color="white"
                icon="sym_o_style"
                :style="{ transitionDelay: `${index * 50}ms` }"
              >
                {{ tag }}
              </q-chip>
            </transition-group>
          </div>
        </div>
      </transition>

      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        :delay="300"
      >
        <q-tabs
          v-model="activeTab"
          class="q-mt-lg"
          :class="$q.dark.isActive ? 'text-white' : 'text-black'"
          active-color="gold"
          indicator-color="primary"
          narrow-indicator
          align="left"
          inline-label
        >
          <q-tab name="about" label="About" icon="sym_o_info" />
          <q-tab name="stories" :label="`Stories (${stories.length})`" icon="sym_o_menu_book" />
          <q-tab name="lore" :label="`Lore (${lore.length})`" icon="sym_o_auto_stories" />
          <q-tab name="characters" :label="`Characters (${characters.length})`" icon="sym_o_face" />
        </q-tabs>
      </transition>

      <q-separator spaced />

      <q-tab-panels
        v-model="activeTab"
        animated
        swipeable
        transition-prev="slide-right"
        transition-next="slide-left"
        class="bg-transparent q-mt-md"
      >
        <q-tab-panel name="about" class="q-pa-none">
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <div
              class="text-body1"
              :class="$q.dark.isActive ? 'text-white' : 'text-black'"
              style="white-space: pre-line"
            >
              {{ universe?.about || 'This universe is still unfolding. More details coming soon!' }}
            </div>
          </transition>
        </q-tab-panel>

        <q-tab-panel name="stories" class="q-pa-none">
          <div v-if="stories.length" class="row q-col-gutter-md">
            <transition-group appear name="card-list-story">
              <div
                class="col-12 col-sm-6 col-md-4 col-lg-3 flex items-stretch"
                v-for="(story, index) in stories"
                :key="story.id"
                :style="{ transitionDelay: `${index * 70}ms` }"
              >
                <SceneCard
                  :title="story.title"
                  :summary="story.description"
                  :tags="story.tags || ['action']"
                  :banner="story.cover_url"
                  @click="$router.push(`/read/${story.id}`)"
                  class="full-width"
                />
              </div>
            </transition-group>
          </div>
          <div v-else class="text-center q-pa-xl text-grey-5">
            <q-icon name="sym_o_menu_book" size="48px" class="q-mb-sm" />
            <div>No stories available yet for this universe.</div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="lore" class="q-pa-none">
          <div v-if="lore.length" class="row q-col-gutter-md">
            <transition-group appear name="card-list-lore">
              <div
                class="col-12 col-sm-6 col-md-4 col-lg-3 flex items-stretch"
                v-for="(entry, index) in lore"
                :key="entry.id"
                :style="{ transitionDelay: `${index * 70}ms` }"
              >
                <LoreEntry
                  :title="entry.title"
                  :summary="entry.summary"
                  :icon="getLoreIcon(entry.type)"
                  @click="handleLoreSelection(entry)"
                  class="full-width"
                />
              </div>
            </transition-group>
          </div>
          <div v-else class="text-center q-pa-xl text-grey-5">
            <q-icon name="sym_o_auto_stories" size="48px" class="q-mb-sm" />
            <div>No lore entries found for this universe yet.</div>
          </div>
          <LorePopup
            v-model="showLorePopup"
            v-if="selectedLore"
            :title="selectedLore.title"
            :content="selectedLore.content"
            @hide="selectedLore = null"
          />
        </q-tab-panel>

        <q-tab-panel name="characters" class="q-pa-none">
          <div v-if="characters.length" class="row q-col-gutter-md">
            <transition-group appear name="card-list-character">
              <div
                class="col-12 col-sm-6 col-md-4 col-lg-3 flex items-stretch"
                v-for="(char, index) in characters"
                :key="char.id"
                :style="{ transitionDelay: `${index * 70}ms` }"
              >
                <CharacterCard
                  :name="char.name"
                  :alias="char.alias"
                  :portrait="char.portrait_url"
                  :tags="char.tags"
                  :bio="char.bio?.substring(0, 100) + (char.bio?.length > 100 ? '...' : '')"
                  :role="char.role_rank || 'N/A'"
                  @click="handleCharacterSelection(char)"
                  class="full-width"
                />
              </div>
            </transition-group>
          </div>
          <div v-else class="text-center q-pa-xl text-grey-5">
            <q-icon name="sym_o_face" size="48px" class="q-mb-sm" />
            <div>No characters introduced in this universe yet.</div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
    <div v-else-if="!isLoading && !universe" class="text-center q-pa-xl">
      <q-icon name="sym_o_error_outline" size="64px" color="negative" />
      <div class="text-h6 text-negative q-mt-md">Universe Not Found</div>
      <div class="text-caption q-mb-lg">
        The requested universe could not be loaded or does not exist.
      </div>
      <q-btn label="Back to Explore" to="/explore" color="primary" icon="sym_o_travel_explore" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Import computed
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar' // For $q.dark

import { supabase } from '@/boot/supabase'
import { getUniverseBannerUrl } from '@/supabase/universeBanners' // Ensure path is correct
import SceneCard from '@/components/story/SceneCard.vue' // Ensure path is correct
import LoreEntry from '@/components/lore/LoreEntry.vue' // Ensure path is correct
import LorePopup from '@/components/lore/LorePopup.vue' // Ensure path is correct
import CharacterCard from '@/components/character/CharacterCard.vue' // Ensure path is correct

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const universeId = route.params.id

const isLoading = ref(true)
const pageLoaded = ref(false) // For main content animation trigger
const universe = ref(null)
const bannerUrl = ref('')
const stories = ref([])
const lore = ref([])
const characters = ref([])

const activeTab = ref('about')
const selectedLore = ref(null)
const showLorePopup = ref(false)

// Helper for lore icons (similar to LoreDashboard)
const getLoreIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'history':
      return 'sym_o_history_edu'
    case 'location':
      return 'sym_o_public'
    case 'character arcana':
      return 'sym_o_person'
    case 'item':
    case 'artifact':
      return 'sym_o_diamond'
    case 'event':
      return 'sym_o_event'
    case 'concept':
    case 'system':
      return 'sym_o_psychology'
    case 'organization':
    case 'faction':
      return 'sym_o_corporate_fare'
    case 'species':
    case 'race':
    case 'creature':
      return 'sym_o_emoji_nature'
    case 'culture':
      return 'sym_o_museum'
    default:
      return 'sym_o_auto_stories'
  }
}

const handleCharacterSelection = (char) => {
  router.push(`/universe/${universeId}/character/${char.id}`)
}

const handleLoreSelection = (loreEntry) => {
  // Option 1: Navigate directly (as you currently have, good for deep linking)
  router.push(`/universe/${universeId}/lore/${loreEntry.id}`)

  // Option 2: Open Popup (if you prefer that for quick views)
  // selectedLore.value = loreEntry;
  // showLorePopup.value = true;
}

onMounted(async () => {
  isLoading.value = true
  pageLoaded.value = false
  try {
    const { data: u, error: universeError } = await supabase
      .from('universes')
      .select('*')
      .eq('id', universeId)
      .single()

    if (universeError) throw universeError
    if (!u) throw new Error('Universe not found')
    universe.value = u

    // Fetch banner after universe is confirmed
    if (universe.value) {
      bannerUrl.value = await getUniverseBannerUrl(universeId)
    }

    // Fetch related data in parallel
    const [storiesResult, loreResult, charactersResult] = await Promise.all([
      supabase
        .from('stories')
        .select('id, title, description, tags, cover_url')
        .eq('universe_id', universeId)
        .eq('visibility', 'public'),
      supabase
        .from('lore_entries')
        .select('id, title, summary, type, content')
        .eq('universe_id', universeId), // Fetch content if LorePopup is used
      supabase
        .from('characters')
        .select('id, name, alias, portrait_url, tags, bio, role_rank')
        .eq('universe_id', universeId), // *** CORRECTED universeId filter ***
    ])

    if (storiesResult.error) throw storiesResult.error
    stories.value = storiesResult.data || []

    if (loreResult.error) throw loreResult.error
    lore.value = loreResult.data || []

    if (charactersResult.error) throw charactersResult.error
    characters.value = charactersResult.data || []
  } catch (error) {
    console.error('Failed to load universe data:', error)
    // Handle error, e.g., show a notification or redirect
    // universe.value will remain null, triggering the "Universe Not Found" message
  } finally {
    isLoading.value = false
    setTimeout(() => {
      pageLoaded.value = true // Trigger entrance animations for main content
    }, 100)
  }
})
</script>

<style lang="scss" scoped>
.text-gold {
  color: #c49a43; /* Or your theme's gold */
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3); // Semi-transparent overlay
  z-index: 9999; // Ensure it's on top
}

.banner-image,
.banner-placeholder {
  transition: opacity 0.5s ease-in-out;
}

.page-loaded .banner-image,
.page-loaded .banner-placeholder {
  opacity: 1;
}
.banner-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  // Add a subtle pattern or icon if desired
}

// Transitions for card lists within tabs
@for $i from 1 through 3 {
  // For story, lore, character lists
  $list-name: if($i == 1, 'story', if($i == 2, 'lore', 'character'));
  .card-list-#{$list-name}-enter-active,
  .card-list-#{$list-name}-leave-active {
    transition: all 0.4s ease-out;
  }
  .card-list-#{$list-name}-enter-from,
  .card-list-#{$list-name}-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  // .card-list-#{$list-name}-move { // Only needed if order can change dynamically within the list
  //   transition: transform 0.4s ease;
  // }
}

// Quasar's Animate.css classes are used directly in the template (e.g., animated fadeInDown).
// Ensure Quasar's animation extra is installed/enabled.
</style>
