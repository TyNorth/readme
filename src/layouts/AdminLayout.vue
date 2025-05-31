<template>
  <q-layout view="lHh LpR fFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'">
      <q-toolbar>
        <q-btn flat dense round icon="sym_o_menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> LoreStrom Admin Panel </q-toolbar-title>

        <q-btn
          flat
          icon="sym_o_public"
          :label="$q.screen.gt.xs ? 'Main Site' : ''"
          to="/"
          class="q-mr-sm"
        />

        <q-space />

        <div v-if="userStore.profile" class="q-mr-md gt-xs">
          <span class="text-caption">Admin: </span>{{ userStore.profile.username }}
        </div>

        <q-btn
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
      :width="260"
      :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-3'"
    >
      <q-list>
        <q-item-label header :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'">
          Admin Menu
        </q-item-label>

        <q-item
          clickable
          v-ripple
          to="/admin/account-requests"
          exact
          active-class="admin-active-link"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_rule_settings" />
          </q-item-section>
          <q-item-section> Account Requests </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user-store'
import { useReaderOptionsStore } from '@/stores/reader-options-store'
import { Dark, Notify, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const leftDrawerOpen = ref(false)
const userStore = useUserStore()
const themeStore = useReaderOptionsStore()
const router = useRouter()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function endSession() {
  await userStore.logout()
  Notify.create({ type: 'positive', message: 'Logged out successfully from Admin Panel.' })
  router.push('/auth/login')
}

const themeIcon = computed(() => {
  return themeStore.theme === 'dark' ? 'sym_o_light_mode' : 'sym_o_dark_mode'
})

function toggleTheme() {
  themeStore.theme = themeStore.theme === 'dark' ? 'light' : 'dark'
  Dark.set(themeStore.theme === 'dark')
  if (typeof document !== 'undefined') {
    document.body.classList.remove(
      'theme-dark',
      'theme-light',
      'bg-dark',
      'bg-light',
      'bg-1e',
      'bg-white',
      'text-white',
      'text-black',
    ) // More comprehensive removal
    document.body.classList.add(`theme-${themeStore.theme}`) // Your global theme class
    // Quasar's Dark.set handles body classes for Quasar components,
    // but your custom theme classes might need this.
  }
  if (themeStore.persist) {
    themeStore.persist()
  }
}

onMounted(async () => {
  if (!userStore.authUser && userStore.isLoggedIn === null) {
    await userStore.initialize()
  } else if (!userStore.authUser && !userStore.isLoggedIn) {
    await userStore.initialize()
  }

  Dark.set(themeStore.theme === 'dark')
  if (typeof document !== 'undefined') {
    document.body.classList.remove(
      'theme-dark',
      'theme-light',
      'bg-dark',
      'bg-light',
      'bg-1e',
      'bg-white',
      'text-white',
      'text-black',
    )
    document.body.classList.add(`theme-${themeStore.theme}`)
  }
})
</script>

<style scoped>
/* Active link styling for admin drawer */
.admin-active-link .q-item__section--avatar .q-icon,
.admin-active-link .q-item__section {
  color: var(--q-primary) !important; /* Use Quasar's primary color for active state */
}
.admin-active-link {
  background-color: rgba(var(--q-primary-rgb), 0.1); /* Subtle background for active link */
}

.q-toolbar-title {
  font-size: 1.1rem;
}
</style>
