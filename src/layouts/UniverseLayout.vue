<template>
  <q-layout
    view="lHh LpR fFf"
    :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'"
  >
    <q-header :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="sym_o_menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-md"
        />

        <q-toolbar-title shrink> {{ universeTitle }} </q-toolbar-title>

        <q-space />

        <q-btn
          v-if="themeStore"
          round
          dense
          flat
          size="md"
          :color="$q.dark.isActive ? 'white' : 'black'"
          :icon="themeIcon"
          @click="toggleTheme"
          aria-label="Toggle Theme"
          class="q-mr-xs"
        />

        <q-btn dense flat icon="sym_o_logout" @click="endSession" aria-label="Logout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-grey-3 text-black'"
    >
      <q-list>
        <q-item-label header :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'">
          Universe Menu
        </q-item-label>

        <q-item
          clickable
          v-ripple
          :to="`/universe/${universeId}/overview`"
          exact
          active-class="nav-active-link"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_space_dashboard" />
          </q-item-section>
          <q-item-section>Overview</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="`/universe/${universeId}/stories`"
          exact
          active-class="nav-active-link"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_menu_book" />
          </q-item-section>
          <q-item-section>Stories</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="`/universe/${universeId}/characters`"
          exact
          active-class="nav-active-link"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_groups" />
          </q-item-section>
          <q-item-section>Characters</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="`/universe/${universeId}/lore`"
          exact
          active-class="nav-active-link"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_auto_stories" />
          </q-item-section>
          <q-item-section>Lore</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue' // Added watch
import { useRoute, useRouter } from 'vue-router' // Added useRouter
import { useUniverseStore } from '@/stores/universe-store'
import { useAuth } from 'src/composables/useAuth' // Your existing auth composable
import { useReaderOptionsStore } from '@/stores/reader-options-store' // For theme
import { Dark, Notify, useQuasar } from 'quasar' // For theme and screen size

const $q = useQuasar()
const route = useRoute()
const router = useRouter() // For logout redirect

const universeStore = useUniverseStore() // Use the store instance directly
const auth = useAuth()
const themeStore = useReaderOptionsStore()

const leftDrawerOpen = ref(false) // For mobile drawer state
const universeId = ref(route.params.universe_id || route.params.id)
const universeTitle = ref('Universe') // Default title

// Function to update title based on store and current universeId
function updateTitle() {
  const currentUniverse = universeStore.universes.find((u) => u.id === universeId.value)
  universeTitle.value = currentUniverse?.title || 'Universe Details'
}

// Watch for route parameter changes to update universeId and title
watch(
  () => route.params.id || route.params.universe_id,
  (newId) => {
    if (newId) {
      universeId.value = newId
      updateTitle() // Update title when ID changes
    }
  },
)

// Watch for changes in the store's universes array
watch(
  () => universeStore.universes,
  () => {
    updateTitle() // Update title if universes list reloads/changes
  },
  { deep: true },
)

onMounted(async () => {
  // Set initial universeId and title
  universeId.value = route.params.universe_id || route.params.id
  // Attempt to fetch universes if not already populated, or if current one isn't found
  if (!universeStore.universes.find((u) => u.id === universeId.value)) {
    // This assumes you have a way to fetch if needed, or that they are pre-loaded
    // For simplicity, we're relying on the store being populated elsewhere for now.
    // A more robust solution might involve `universeStore.fetchUniverse(universeId.value)` if it exists
  }
  updateTitle() // Update title on mount

  // Theme initialization
  Dark.set(themeStore.theme === 'dark')
  if (typeof document !== 'undefined') {
    document.body.classList.remove('theme-dark', 'theme-light', 'bg-dark', 'bg-light')
    document.body.classList.add(`theme-${themeStore.theme}`)
  }
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function endSession() {
  try {
    await auth.logout() // Using your existing useAuth composable
    Notify.create({ type: 'positive', message: 'Logged out successfully.' })
    router.push('/auth/login') // Or wherever you want to redirect after logout
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Logout failed.' })
    console.error('Logout error:', error)
  }
}

// Theme toggle logic (consistent with other layouts)
const themeIcon = computed(() => {
  return themeStore.theme === 'dark' ? 'sym_o_light_mode' : 'sym_o_dark_mode'
})

function toggleTheme() {
  themeStore.theme = themeStore.theme === 'dark' ? 'light' : 'dark'
  Dark.set(themeStore.theme === 'dark')
  if (typeof document !== 'undefined') {
    document.body.classList.remove('theme-dark', 'theme-light', 'bg-dark', 'bg-light')
    document.body.classList.add(`theme-${themeStore.theme}`)
  }
  if (themeStore.persist) {
    themeStore.persist()
  }
}
</script>

<style scoped>
/* Active link styling for drawer */
.nav-active-link .q-item__section--avatar .q-icon,
.nav-active-link .q-item__section {
  color: var(--q-primary) !important;
}
.nav-active-link {
  background-color: rgba(var(--q-primary-rgb), 0.1);
}
</style>
