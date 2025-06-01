<template>
  <q-layout
    view="hHh lpR fFf"
    class="editor-layout"
    :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'"
  >
    <!-- Optional Header -->
    <q-header v-if="true" class="bg-grey-10 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="sym_o_arrow_back" @click="goBack" />
        <q-toolbar-title> ✍️ Editor </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.editor-layout {
  background-color: #141516;
  color: white;
}
</style>
