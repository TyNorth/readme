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

        <!-- Creator Mode Toggle -->
        <q-toggle
          v-if="router.currentRoute.value.path == '/'"
          v-model="creatorMode"
          label="Creator Mode"
          color="secondary"
          keep-color
          checked-icon="sym_o_edit"
          unchecked-icon="sym_o_auto_stories"
        />

        <q-btn flat icon="sym_o_account_circle" to="/profile" />
        <q-btn dense flat icon="sym_o_logout" @click="endSession" />

        <q-btn
          round
          dense
          flat
          size="md"
          :color="themeColor"
          :icon="themeIcon"
          @click="toggleTheme"
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
import { Dark } from 'quasar'
import { useRouter } from 'vue-router'
import AppBreadcrumbs from '@/components/nav/AppBreadcrumbs.vue'
import { useAuth } from 'src/composables/useAuth'

const store = useReaderOptionsStore()
const router = useRouter()
const auth = useAuth()

async function endSession() {
  await auth.logout()
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
const userStore = useUserStore()

// Two-way bind using Pinia state + action
const creatorMode = computed({
  get: () => userStore.creatorMode,
  set: (val) => userStore.setCreatorMode(val),
})

onMounted(async () => {
  if (!userStore.authUser || !userStore.profile) {
    await userStore.initialize()
  }
})
</script>
