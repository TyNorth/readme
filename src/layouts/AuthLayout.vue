<template>
  <q-layout view="lHh Lpr lFf" :class="themeClass">
    <q-header :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'">
      <q-toolbar>
        <q-toolbar-title>📖 LoreStrom</q-toolbar-title>

        <!-- Right-aligned theme toggle -->
        <q-space />
        <q-btn round dense flat :icon="themeIcon" :color="toggleColor" @click="toggleTheme" />
        <q-btn dense flat icon="sym_o_logout" @click="endSession" />
      </q-toolbar>
    </q-header>

    <q-page-container class="flex flex-center q-pa-xl">
      <q-card flat class="q-pa-xl auth-card">
        <router-view />
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useReaderOptionsStore } from '@/stores/reader-options-store'
import { Dark } from 'quasar'
import { useAuth } from 'src/composables/useAuth'

const store = useReaderOptionsStore()

const themeClass = computed(() => {
  return store.theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-black'
})

const toggleColor = computed(() => (store.theme === 'dark' ? 'white' : 'black'))

const themeIcon = computed(() => (store.theme === 'dark' ? 'sym_o_light_mode' : 'sym_o_dark_mode'))
const auth = useAuth()

async function endSession() {
  await auth.logout()
}

function toggleTheme() {
  store.theme = store.theme === 'dark' ? 'light' : 'dark'
  Dark.set(store.theme === 'dark')
  document.body.classList.remove('theme-dark', 'theme-light')
  document.body.classList.add(`theme-${store.theme}`)
  store.persist()
}
</script>

<style scoped>
.auth-card {
  min-width: 300px;
  max-width: 400px;
  width: 100%;
  border-radius: 12px;
  background-color: transparent;
  box-shadow: none;
  padding: 2rem 1.5rem;
}
</style>
