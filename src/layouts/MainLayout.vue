<template>
  <q-layout view="hHh lpR fFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'">
      <q-toolbar>
        <q-toolbar-title>📖 LoreLight</q-toolbar-title>
        <q-btn flat label="Explore" to="/explore" />
        <q-btn
          v-if="userStore.profile?.id"
          flat
          label="My Universes"
          :to="`/my-universes/${userStore.profile?.id}`"
        />

        <q-space />
        <template v-if="userStore.profile">
          <q-toggle
            v-model="creatorMode"
            label="Creator Mode"
            color="secondary"
            keep-color
            checked-icon="sym_o_edit"
            unchecked-icon="sym_o_auto_stories"
          />
        </template>

        <template v-if="userStore.profile">
          <q-btn flat icon="sym_o_account_circle" to="/profile" aria-label="Profile" />
          <q-btn dense flat icon="sym_o_logout" @click="endSession" aria-label="Logout" />
        </template>
        <template v-else>
          <q-btn flat icon="sym_o_login" label="Login" @click="goToLogin" />
        </template>
        <q-btn
          round
          dense
          flat
          size="md"
          :color="themeColor"
          :icon="themeIcon"
          @click="toggleTheme"
          aria-label="Toggle Theme"
        />
      </q-toolbar>
      <q-toolbar
        :class="$q.dark.isActive ? 'bg-1e text-white' : 'bg-white text-black'"
        class="q-px-md"
      >
        <AppBreadcrumbs />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-grey-5 q-pa-sm">
      <div class="text-center">© {{ new Date().getFullYear() }} LoreLight</div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user-store'
import { useReaderOptionsStore } from '@/stores/reader-options-store'
import { Dark, Notify } from 'quasar' // Import Notify for feedback
import { useRouter } from 'vue-router'
import AppBreadcrumbs from '@/components/nav/AppBreadcrumbs.vue'
import { useAuth } from 'src/composables/useAuth'

const store = useReaderOptionsStore()
const router = useRouter()
const auth = useAuth()
const userStore = useUserStore() // Ensure userStore is defined

async function endSession() {
  console.log('logging out via store!')
  await userStore.logout() // <-- Use the store's action
  Notify.create({ type: 'positive', message: 'Logged out successfully.' })
  router.push('/') // Redirect to home
}

async function goToLogin() {
  await userStore.logout()
  console.log('goToLogin called.')
  console.log('Current user profile:', userStore.profile)
  console.log('Navigating to /auth/login...')
  try {
    router.push('/auth/login')
    console.log('router.push completed.')
  } catch (error) {
    console.error('Error during router.push:', error)
  }
}

const themeIcon = computed(() => {
  return store.theme === 'dark' ? 'sym_o_light_mode' : 'sym_o_dark_mode'
})

const themeColor = computed(() => {
  return store.theme === 'dark' ? 'white' : 'black'
})

function toggleTheme() {
  store.theme = store.theme === 'dark' ? 'light' : 'dark'
  Dark.set(store.theme === 'dark')
  document.body.classList.remove('theme-dark', 'theme-light')
  document.body.classList.add(`theme-${store.theme}`)
  store.persist()
}

// Two-way bind using Pinia state + action
const creatorMode = computed({
  get: () => userStore.creatorMode,
  set: (val) => userStore.setCreatorMode(val),
})

onMounted(async () => {
  // Ensure the user state is checked/loaded when the layout mounts
  if (!userStore.authUser) {
    await userStore.initialize()
  }
  // Set initial theme
  Dark.set(store.theme === 'dark')
  document.body.classList.add(`theme-${store.theme}`)
})
</script>

<style scoped>
/* Optional: Add some spacing if needed */
.q-toolbar .q-btn {
  margin: 0 4px;
}
.q-toolbar .q-toggle {
  margin: 0 8px;
}
</style>
