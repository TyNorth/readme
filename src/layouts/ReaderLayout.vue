<template>
  <q-layout
    view="lHh Lpr lFf"
    :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-light text-black'"
  >
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
