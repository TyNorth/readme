<template>
  <q-layout
    view="hHh lpR fFf"
    class="editor-layout"
    :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'"
  >
    <q-header :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'" elevated>
      <q-toolbar>
        <q-btn flat dense round icon="sym_o_arrow_back" @click="goBack" aria-label="Go Back" />
        <q-toolbar-title shrink class="gt-xs"> ✍️ Editor </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router' // Import useRoute
import { useQuasar } from 'quasar' // Import useQuasar for $q object

const router = useRouter()
const route = useRoute() // To help with a more robust goBack
const $q = useQuasar() // For accessing $q.dark.isActive in the script if needed, though it's used directly in template

function goBack() {
  // Check if there's a previous page in the history stack for this session
  // window.history.length > 2 is a common heuristic to see if there's actually a "back" beyond the initial entry
  if (window.history.length > 2 && router.options.history.state.back) {
    router.back()
  } else {
    // Fallback navigation if router.back() is not suitable
    // This logic should be tailored to your application's structure
    // Example: if editing a chapter, go back to the story editor/overview
    if (route.params.storyId && route.params.chapterId) {
      // If we are in /editor/:storyId/chapter/:chapterId
      router.push(`/editor/${route.params.storyId}`) // Go to parent story editor
    } else if (route.params.storyId) {
      // If we are in /editor/:storyId (e.g., StoryEditor page itself)
      // You might want to navigate to the story's overview in the universe dashboard,
      // or the list of stories. This depends on how users get to /editor/:storyId.
      // For now, a generic fallback:
      router.push('/') // Or a relevant dashboard page e.g., '/my-universes'
    } else {
      router.push('/') // Absolute default fallback
    }
  }
}
</script>

<style scoped>
/* .editor-layout {
  background-color: #141516; // REMOVED to allow dynamic theming
  color: white; // REMOVED
} */

/* The class 'editor-layout' can be used for specific overrides if needed,
   but the base background and text color should now come from the
   :class binding on q-layout for theme consistency. */
</style>
