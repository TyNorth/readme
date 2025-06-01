<template>
  <q-page class="q-pa-md text-white">
    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <div class="text-h4 text-gold q-mb-md">Explore Worlds</div>
    </transition>

    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-img
        v-if="showContent"
        src="/src/assets/images/explore_worlds.png"
        class="rounded-borders q-mb-lg banner-image"
        style="max-height: 250px; object-fit: cover"
        fit="cover"
        spinner-color="primary"
      />
    </transition>

    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="showContent" class="row q-col-gutter-md q-mb-lg filter-controls">
        <q-select
          :dark="$q.dark.isActive"
          v-model="selectedGenre"
          :options="genres"
          label="Genre"
          filled
          dense
          class="col-12 col-sm-4"
          clearable
          options-dense
          transition-show="jump-down"
          transition-hide="jump-up"
        />
        <q-select
          :dark="$q.dark.isActive"
          v-model="selectedMood"
          :options="moods"
          label="Mood"
          filled
          dense
          class="col-12 col-sm-4"
          clearable
          options-dense
          transition-show="jump-down"
          transition-hide="jump-up"
        />
        <q-input
          :dark="$q.dark.isActive"
          v-model="search"
          label="🔍 Search Worlds"
          dense
          filled
          debounce="300"
          class="col-12 col-sm-4"
          clearable
        />
      </div>
    </transition>

    <div v-if="isLoadingUniverses" class="flex flex-center q-my-xl">
      <q-spinner-puff color="primary" size="3em" />
      <div class="q-ml-md text-subtitle1">Loading Universes...</div>
    </div>

    <div
      v-else-if="!isLoadingUniverses && filteredUniverses.length === 0 && showContent"
      class="text-center q-pa-xl"
    >
      <q-icon name="sym_o_travel_explore" size="64px" color="grey-7" />
      <div class="text-h6 text-grey-5 q-mt-md">No Worlds Found</div>
      <div class="text-caption text-grey-6 q-mb-lg">
        Try adjusting your search or filters, or check back later for new universes!
      </div>
    </div>

    <transition-group
      v-else-if="showContent"
      appear
      tag="div"
      class="row q-col-gutter-md flex justify-stretch"
      name="card-list"
    >
      <div
        v-for="universe in filteredUniverses"
        :key="universe.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 flex items-stretch"
      >
        <UniverseCard
          :title="universe.title"
          :summary="universe.summary"
          :banner="universe.banner_url"
          :tags="universe.tags"
          @click="$router.push(`/universe/${universe.id}/view`)"
          class="full-width"
        />
      </div>
    </transition-group>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUniverseStore } from '@/stores/universe-store'
import UniverseCard from '@/components/universe/UniverseCard.vue' // Ensure this path is correct
import { useQuasar } from 'quasar' // For $q.dark

const $q = useQuasar() // If you need $q.dark.isActive in script, though it's used in template here

const universeStore = useUniverseStore()
const search = ref('')
const selectedGenre = ref(null)
const selectedMood = ref(null)
const showContent = ref(false) // For initial page load animation control
const isLoadingUniverses = ref(true) // Separate loading for universes fetch

const genres = [
  'Fantasy',
  'Sci-Fi',
  'Mystery',
  'Historical',
  'Adventure',
  'Horror',
  'Slice of Life',
]
const moods = ['Whimsical', 'Dark', 'Hopeful', 'Epic', 'Melancholic', 'Gritty', 'Humorous']

onMounted(async () => {
  isLoadingUniverses.value = true
  try {
    await universeStore.fetchPublicUniverses()
    // if (universeStore.universes) console.info(`Universes loaded! Count: ${universeStore.universes.length}`);
  } catch (error) {
    console.error('Failed to fetch universes:', error)
    // Optionally show a notification
  } finally {
    isLoadingUniverses.value = false
    // Start animations after a brief delay or after data is ready
    setTimeout(() => {
      showContent.value = true
    }, 100) // Slight delay for smoother initial animation
  }
})

const filteredUniverses = computed(() => {
  if (isLoadingUniverses.value || !universeStore.universes) {
    return []
  }
  return universeStore.universes.filter((u) => {
    const searchLower = search.value.toLowerCase()
    const matchesSearch =
      u.title.toLowerCase().includes(searchLower) ||
      (u.summary && u.summary.toLowerCase().includes(searchLower))
    const matchesGenre = selectedGenre.value ? u.tags?.includes(selectedGenre.value) : true
    const matchesMood = selectedMood.value ? u.tags?.includes(selectedMood.value) : true
    return matchesSearch && matchesGenre && matchesMood
  })
})
</script>

<style lang="scss" scoped>
.text-gold {
  color: #c49a43; /* Or your theme's gold */
}

.banner-image {
  // Consider adding a subtle overlay if text on it is ever an issue
  // or a slight animation on load
}

.filter-controls {
  // Styling for the filter container if needed
}

// Transitions for the card list
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
.card-list-move {
  /* Ensures smooth transition when items reorder */
  transition: transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

// Quasar's Animate.css classes are used directly in the template for initial load
// e.g., animated fadeInDown. Ensure Quasar's animation extra is installed.
</style>
