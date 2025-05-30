<template>
  <q-layout view="hHh lpR fFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'">
      <q-toolbar>
        <q-toolbar-title>📖 LoreLight</q-toolbar-title>

        <q-btn flat :label="$q.screen.gt.xs ? 'Explore' : ''" icon="sym_o_explore" to="/explore" />
        <q-btn
          v-if="userStore.profile?.id"
          flat
          :label="$q.screen.gt.xs ? 'My Universes' : ''"
          icon="sym_o_hub"
          :to="`/my-universes/${userStore.profile?.id}`"
        />

        <q-btn
          v-if="isAdmin"
          flat
          :label="$q.screen.gt.xs ? 'Admin' : ''"
          icon="sym_o_admin_panel_settings"
          to="/admin/account-requests"
          class="q-ml-sm"
        />

        <q-space />

        <template v-if="userStore.profile">
          <q-toggle
            v-model="creatorMode"
            :label="$q.screen.gt.sm ? 'Creator Mode' : ''"
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
          <q-btn
            flat
            icon="sym_o_login"
            :label="$q.screen.gt.xs ? 'Login' : ''"
            @click="goToLogin"
            aria-label="Login"
          />
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
import { Dark, Notify, useQuasar } from 'quasar' // Import useQuasar
import { useRouter } from 'vue-router'
import AppBreadcrumbs from '@/components/nav/AppBreadcrumbs.vue'
// Assuming useAuth is no longer needed here if logout is fully handled by userStore
// import { useAuth } from 'src/composables/useAuth';

const $q = useQuasar() // For screen size detection
const store = useReaderOptionsStore()
const router = useRouter()
const userStore = useUserStore()

// Define your ADMIN_USER_IDS here or import from a config file
const ADMIN_USER_IDS = [
  '9143b6ad-af63-4959-8ed9-f63f4c8ade65',
  '5682c3f9-883b-4052-8f6f-1700e05d4ea3',
  '860ada3e-d10b-4dd1-915e-2411227acac4',
  '4061b290-88f3-403b-a799-dcb1974f5a0b',
  // Add other admin user IDs here
]

const isAdmin = computed(() => {
  return userStore.profile && ADMIN_USER_IDS.includes(userStore.authUser?.id || '')
})

async function endSession() {
  console.log('logging out via store!')
  await userStore.logout()
  Notify.create({ type: 'positive', message: 'Logged out successfully.' })
  router.push('/')
}

async function goToLogin() {
  // This explicit logout before navigating to login was a workaround for a specific state issue.
  // Ideally, this isn't needed if user state is perfectly managed.
  // If initialize() and logout() correctly clear state, this might be redundant.
  if (userStore.isLoggedIn) {
    // Only logout if actually logged in, to prevent errors if state is already cleared
    await userStore.logout()
  }
  console.log('goToLogin called.')
  // console.log('Current user profile after potential logout:', userStore.profile);
  console.log('Navigating to /auth/login...')
  try {
    router.push('/auth/login')
    // console.log('router.push completed.');
  } catch (error) {
    console.error('Error during router.push to login:', error)
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

const creatorMode = computed({
  get: () => userStore.creatorMode,
  set: (val) => userStore.setCreatorMode(val),
})

onMounted(async () => {
  if (!userStore.authUser && userStore.isLoggedIn === null) {
    // More specific check if store tracks loading/initial state
    await userStore.initialize()
  } else if (!userStore.authUser) {
    // Fallback if isLoggedIn isn't initially null
    await userStore.initialize()
  }

  Dark.set(store.theme === 'dark')
  if (typeof document !== 'undefined') {
    // Guard for SSR or testing environments
    document.body.classList.add(`theme-${store.theme}`)
  }
})
</script>

<style scoped>
/* Optional: Add some spacing if needed */
.q-toolbar .q-btn,
.q-toolbar .q-toggle {
  margin: 0 2px; /* Reduced margin for tighter packing */
}
</style>
