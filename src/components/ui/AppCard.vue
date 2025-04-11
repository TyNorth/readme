<template>
  <q-card flat bordered class="rounded-borders q-pa-md" v-bind="$attrs">
    <slot name="header" />
    <q-separator v-if="$slots.header" class="q-mb-md" />

    <slot />

    <q-separator v-if="$slots.footer" class="q-mt-md" />
    <slot name="footer" />
  </q-card>
</template>
