<template>
  <div>
    <!-- Floating FAB -->
    <q-btn
      class="fixed-bottom-right q-ma-md"
      icon="sym_o_menu_book"
      round
      color="primary"
      size="md"
      @click="open = true"
    />

    <!-- Chapter Selector Dialog -->
    <q-dialog v-model="open" persistent>
      <q-card class="bg-dark text-white q-pa-md" style="min-width: 250px; max-width: 400px">
        <div class="text-subtitle2 text-gold q-mb-sm">Jump to Chapter</div>
        <q-list bordered>
          <q-item
            v-for="ch in chapters"
            :key="ch.id"
            clickable
            @click="selectChapter(ch.id)"
            :active="ch.id === currentChapterId"
            active-class="bg-primary text-white"
          >
            <q-item-section>
              <q-item-label>{{ ch.title }}</q-item-label>
              <q-item-label class="text-shimmer text-italic" caption>{{ ch.summary }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon name="sym_o_bookmark" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn flat label="Close" class="q-mt-md" color="grey-5" @click="open = false" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  chapters: Array,
  currentChapterId: String,
})

const emit = defineEmits(['select'])

const open = ref(false)

function selectChapter(id) {
  emit('select', id)
  open.value = false
}
</script>
