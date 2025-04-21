<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-gold">Stories</div>
      <q-btn-toggle
        v-model="viewMode"
        dense
        flat
        toggle-color="primary"
        :options="[
          { value: 'list', icon: 'sym_o_view_list' },
          { value: 'card', icon: 'sym_o_view_module' },
          { value: 'timeline', icon: 'sym_o_timeline' },
        ]"
      />
    </div>

    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner size="32px" color="primary" />
    </div>

    <StoryListView v-if="viewMode === 'list'" :stories="stories" @edit="editStory" />
    <StoryCardGridView v-if="viewMode === 'card'" :stories="stories" @edit="editStory" />
    <StoryTimelineView v-if="viewMode === 'timeline'" :stories="stories" @edit="editStory" />

    <q-btn
      round
      fab
      icon="sym_o_add"
      color="primary"
      class="fixed-bottom-right q-ma-md z-top"
      @click="createOpen = true"
    />

    <CreateStoryWizard v-model="createOpen" @created="stories.push($event)" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/boot/supabase'

import StoryListView from '@/components/universe/dashboard/StoryListView.vue'
import StoryCardGridView from '@/components/universe/dashboard/StoryCardGridView.vue'
import StoryTimelineView from '@/components/universe/dashboard/StoryTimelineView.vue'
import CreateStoryWizard from '@/elements/wizard/CreateStoryWizard.vue'

const createOpen = ref(false)

const route = useRoute()
const router = useRouter()
const universeId = route.params.id

const stories = ref([])
const loading = ref(false)
const viewMode = ref('list')

onMounted(async () => {
  loading.value = true
  const { data, error } = await supabase.from('stories').select('*').eq('universe_id', universeId)

  stories.value = data || []
  loading.value = false
})

function editStory(story) {
  router.push(`/universe/${universeId}/stories/${story.id}/overview`)
}
</script>
