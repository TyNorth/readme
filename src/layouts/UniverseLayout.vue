<template>
  <q-layout view="hHh lpR fFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'">
      <q-toolbar>
        <q-toolbar-title>{{ universeTitle }}</q-toolbar-title>
        <q-space />
        <q-btn dense flat icon="sym_o_logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above>
      <q-list>
        <q-item clickable to="overview">
          <q-item-section>Overview</q-item-section>
        </q-item>
        <q-item clickable to="stories">
          <q-item-section>Stories</q-item-section>
        </q-item>
        <q-item clickable to="characters">
          <q-item-section>Characters</q-item-section>
        </q-item>
        <q-item clickable to="lore">
          <q-item-section>Lore</q-item-section>
        </q-item>
        <q-item clickable to="map">
          <q-item-section>Map</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useUniverseStore } from '@/stores/universe-store'
const { universes } = useUniverseStore()
const route = useRoute()
const universeId = route.params.id
const universeTitle = universes.find((u) => u.id === universeId)?.title || 'Universe'
</script>
