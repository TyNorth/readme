<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-dark text-gold">
      <q-toolbar>
        <q-toolbar-title>📖 Mythmaker</q-toolbar-title>
        <q-btn flat label="Explore" to="/explore" />
        <q-btn flat label="My Universes" to="/my-universes" />
        <q-space />
        <q-btn flat icon="sym_o_account_circle" to="/profile" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-grey-5 q-pa-sm">
      <div class="text-center">© {{ new Date().getFullYear() }} Mythmaker</div>
    </q-footer>
  </q-layout>
</template>
