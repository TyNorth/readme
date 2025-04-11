<template>
  <q-splitter v-model="split" class="bg-grey-10 text-white rounded-borders">
    <template #before>
      <q-editor
        v-model="model"
        :definitions="{}"
        :toolbar="[]"
        height="100%"
        class="q-pa-md"
        placeholder="Start writing your scene..."
        content-style="font-family: serif;"
        v-bind="$attrs"
      />
    </template>
    <template #after>
      <div class="q-pa-md scroll column full-height">
        <div class="text-subtitle2 q-mb-sm text-grey-5">Preview</div>
        <div v-html="rendered" class="markdown" />
      </div>
    </template>
  </q-splitter>
</template>

<script setup>
import { computed, ref } from 'vue'
import { parseMarkdown } from '@/utils/parser'

const model = defineModel('text')
const split = ref(50)

const rendered = computed(() => parseMarkdown(model.value || ''))
</script>

<style scoped>
.markdown :deep(h1) {
  font-size: 1.5rem;
}
.markdown :deep(p) {
  line-height: 1.7;
  margin-bottom: 1rem;
}
</style>
