<template>
  <q-page class="q-pa-md text-white">
    <div class="text-h4 text-gold q-mb-md">Explore Worlds</div>

    <!-- Banner -->
    <q-img
      src="/src/assets/images/explore_worlds.png"
      class="rounded-borders q-mb-lg"
      style="max-height: 250px; object-fit: cover"
      fit="cover"
    />

    <!-- Filters -->
    <div class="row q-col-gutter-md q-mb-md">
      <q-select
        :dark="$q.dark.isActive"
        v-model="selectedGenre"
        :options="genres"
        label="Genre"
        filled
        dense
        class="col-12 col-sm-4"
        clearable
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
      />
      <q-input
        :dark="$q.dark.isActive"
        v-model="search"
        :label="`🔍 Search`"
        dense
        filled
        debounce="300"
        class="col-12 col-sm-4"
        clearable
      />
    </div>

    <!-- Universes Grid -->
    <div class="q-gutter-md row q-col-gutter-md flex justify-stretch">
      <div v-for="universe in filteredUniverses" :key="universe.id">
        <UniverseCard
          :title="universe.title"
          :summary="universe.summary"
          :banner="universe.banner_url"
          :tags="universe.tags"
          @click="$router.push(`/universe/${universe.id}/view`)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUniverseStore } from '@/stores/universe-store'
import UniverseCard from '@/components/universe/UniverseCard.vue'

const universeStore = useUniverseStore()
const search = ref('')
const selectedGenre = ref(null)
const selectedMood = ref(null)

const genres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Historical', 'Adventure']
const moods = ['Whimsical', 'Dark', 'Hopeful', 'Epic', 'Melancholic']

onMounted(async () => {
  await universeStore.fetchPublicUniverses()
  console.log(universeStore.universes)
})

const filteredUniverses = computed(() => {
  return universeStore.universes.filter((u) => {
    const matchesSearch = u.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesGenre = selectedGenre.value ? u.tags?.includes(selectedGenre.value) : true
    const matchesMood = selectedMood.value ? u.tags?.includes(selectedMood.value) : true
    return matchesSearch && matchesGenre && matchesMood
  })
})
</script>
