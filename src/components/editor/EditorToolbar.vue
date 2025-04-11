<template>
  <q-toolbar class="bg-grey-9 text-white rounded-borders q-mb-sm">
    <q-btn flat round dense icon="sym_o_format_bold" @click="$emit('action', 'bold')" />
    <q-btn flat round dense icon="sym_o_format_italic" @click="$emit('action', 'italic')" />
    <q-btn flat round dense icon="sym_o_code" @click="$emit('action', 'code')" />
    <q-btn flat round dense icon="sym_o_format_quote" @click="$emit('action', 'quote')" />
    <q-btn flat round dense icon="sym_o_label" @click="$emit('action', 'tag')" />

    <q-space />
    <slot />
  </q-toolbar>
</template>

<script setup>
defineEmits(['action'])
</script>
