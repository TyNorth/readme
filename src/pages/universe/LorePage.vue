<template>
  <q-page class="q-pa-md bg-dark text-white row items-start q-col-gutter-xl">
    <!-- Main Content Column -->
    <div class="col-12 col-md-8">
      <div v-if="loreEntry" class="lore-page-wrapper q-mx-auto">
        <!-- Header -->
        <div class="row items-center q-gutter-sm q-mb-xs">
          <q-icon :name="`sym_o_${'auto_stories'}`" size="24px" color="primary" />
          <div class="text-h4 text-gold">{{ loreEntry.title }}</div>
        </div>

        <!-- Tags -->
        <div class="row q-gutter-xs q-mb-md">
          <q-chip
            v-for="tag in loreEntry.tags || []"
            :key="tag"
            dense
            color="primary"
            text-color="white"
            icon="sym_o_style"
          >
            {{ tag }}
          </q-chip>
        </div>

        <!-- Summary -->
        <div v-if="loreEntry.summary" class="text-grey-4 text-italic text-subtitle1 q-mb-lg lh-lg">
          {{ loreEntry.summary }}
        </div>

        <!-- Linked Lore Content -->
        <q-card flat bordered class="bg-grey-9 text-white q-pa-lg">
          <div v-html="linkedContent" class="text-body lore-html lore-text" />
        </q-card>

        <!-- Metadata -->
        <div class="q-mt-md text-caption text-grey-5">
          From Universe:
          <router-link :to="`/universe/${universeId}/view`" class="text-primary text-weight-medium">
            {{ universe?.title || 'Unknown Universe' }}
          </router-link>
          <br />
          Created: {{ formatDate(loreEntry.created_at) }}
        </div>
      </div>

      <div v-else class="q-pa-xl flex flex-center">
        <q-spinner size="32px" color="primary" />
      </div>
    </div>

    <!-- Animated Linked Entity Panel -->
    <transition name="slide-fade">
      <div v-if="showSidebar" class="col-12 col-md-4 q-mt-md" style="max-width: 320px">
        <q-card flat bordered class="bg-grey-10 text-white q-pa-md">
          <div class="text-subtitle2 text-gold q-mb-md">Mentioned in This Lore</div>

          <div v-if="linkedCharacters.length">
            <div class="text-caption text-grey-5 q-mb-xs">Characters:</div>
            <q-list>
              <q-item
                v-for="char in linkedCharacters"
                :key="char.id"
                clickable
                :to="`/universe/${universeId}/character/${char.id}`"
                class="q-py-xs"
              >
                <q-item-section>{{ char.name }}</q-item-section>
              </q-item>
            </q-list>
          </div>

          <q-btn
            v-if="isMobile"
            flat
            dense
            icon="sym_o_close"
            class="q-mt-md full-width"
            color="grey-5"
            @click="drawerOpen = false"
          />
        </q-card>
      </div>
    </transition>

    <!-- FAB for Mobile Toggle -->
    <q-btn
      v-if="isMobile && !drawerOpen"
      round
      dense
      icon="sym_o_local_library"
      color="primary"
      class="fixed-bottom-right q-ma-md z-top"
      @click="drawerOpen = true"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from '@/boot/supabase'
import { parseLoreContent } from '@/utils/parseLore'

const route = useRoute()
const $q = useQuasar()

const universeId = route.params.universeId
const loreId = route.params.loreId

const drawerOpen = ref(false)
const isMobile = computed(() => $q.screen.lt.md)
const showSidebar = computed(() => !isMobile.value || drawerOpen.value)

const loreEntry = ref(null)
const universe = ref(null)
const characters = ref([])

onMounted(async () => {
  const [{ data: lore }, { data: u }, { data: c }] = await Promise.all([
    supabase.from('lore_entries').select('*').eq('id', loreId).single(),
    supabase.from('universes').select('id, title').eq('id', universeId).single(),
    supabase.from('characters').select('id, name').eq('universe_id', universeId),
  ])

  loreEntry.value = lore
  universe.value = u
  characters.value = c || []
})

const linkedCharacters = computed(() =>
  characters.value.filter((char) =>
    loreEntry.value?.content?.toLowerCase().includes(char.name.toLowerCase()),
  ),
)

const linkedContent = computed(() => {
  return parseLoreContent({
    rawText: loreEntry.value?.content,
    characters: characters.value,
    universeId,
  })
})

function formatDate(date) {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.lore-page-wrapper {
  max-width: 720px;
}
.lore-html :deep(a) {
  color: var(--q-primary);
  text-decoration: underline;
  cursor: pointer;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.lore-html :deep(a.linked-entity) {
  color: var(--q-primary);
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}
.lore-html :deep(a.linked-entity:hover) {
  color: gold;
}

.lore-text {
  line-height: 2em;
  font-size: 1.3em;
}
</style>
