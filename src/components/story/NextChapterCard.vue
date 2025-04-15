<template>
  <q-card
    v-if="nextChapter"
    flat
    :class="
      $q.dark.isActive
        ? 'text-subtitle1 text-italic bg-grey-9 q-mb-md'
        : 'text-subtitle1 text-italic bg-grey-3 q-mb-md'
    "
    class="q-mt-xl q-pa-md text-white rounded-borders cursor-pointer hoverable"
    @click="$emit('next', nextChapter.id)"
  >
    <div
      class="row items-center justify-between"
      :class="
        $q.dark.isActive
          ? 'text-subtitle1 text-italic text-grey-5 '
          : 'text-subtitle1 text-italic text-grey-9 '
      "
    >
      <div>
        <div class="text-subtitle2 text-gold">Next Chapter</div>
        <div class="text-body2">{{ nextChapter.title }}</div>
        <div class="text-caption ellipsis-2-lines">
          {{ nextChapter.summary }}
        </div>
      </div>
      <q-icon name="sym_o_navigate_next" color="primary" size="28px" />
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  nextChapter: Object,
})

defineEmits(['next'])
</script>
