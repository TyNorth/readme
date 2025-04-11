<template>
  <q-btn
    :label="label"
    :icon="icon ? `sym_o_${icon}` : undefined"
    :color="color"
    :flat="flat"
    :outline="outline"
    :unelevated="unelevated"
    :dense="dense"
    :round="round"
    :size="size"
    :to="to"
    :loading="loading"
    :disable="disable"
    v-bind="$attrs"
    @click="$emit('click')"
  />
</template>

<script setup>
defineProps({
  label: String,
  icon: String,
  color: { type: String, default: 'primary' },
  flat: Boolean,
  outline: Boolean,
  unelevated: Boolean,
  dense: Boolean,
  round: Boolean,
  size: { type: String, default: 'md' },
  to: [String, Object],
  loading: Boolean,
  disable: Boolean,
})

defineEmits(['click'])
</script>
