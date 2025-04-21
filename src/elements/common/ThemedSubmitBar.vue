<template>
  <div class="themed-submit-bar row justify-center items-center q-mt-lg">
    <q-btn
      :label="label"
      :loading="loading"
      color="gold"
      :icon="icon"
      :disable="disable"
      @click="$emit('submit')"
    />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Save',
  },
  icon: {
    type: String,
    default: 'sym_o_add',
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  loading: Boolean,
  disable: Boolean,
})

defineEmits(['submit', 'cancel'])
</script>

<style scoped>
.themed-submit-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1rem;
}

.q-btn {
  background-color: #c49a43;
  color: black;
}
.q-btn:hover {
  background-color: #dfb45d;
}
</style>
