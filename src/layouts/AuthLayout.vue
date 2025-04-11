<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark text-white">
    <q-page-container class="flex flex-center q-pa-xl">
      <q-card flat bordered class="q-pa-lg" style="min-width: 300px; max-width: 400px">
        <router-view />
      </q-card>
    </q-page-container>
  </q-layout>
</template>
