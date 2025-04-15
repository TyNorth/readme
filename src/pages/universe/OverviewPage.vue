<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <DashboardHeader title="Universe Overview" subtitle="Manage this world and its domains.">
      <template #actions>
        <q-btn icon="sym_o_visibility" flat :label="universe.visibility" />
        <q-btn icon="sym_o_delete" flat color="negative" @click="confirmDelete" />
      </template>
    </DashboardHeader>

    <!-- Editable Universe Info -->
    <q-card flat bordered class="q-pa-md bg-grey-9 text-white q-mb-lg">
      <div class="q-gutter-md">
        <div>
          <div class="text-caption text-grey-5 q-mb-xs">Title</div>
          <InlineEditableText
            v-model="universe.title"
            @update:modelValue="updateField('title', $event)"
          />
        </div>

        <div>
          <div class="text-caption text-grey-5 q-mb-xs">Summary</div>
          <InlineEditableText
            v-model="universe.summary"
            @update:modelValue="updateField('summary', $event)"
          />
        </div>

        <div>
          <div class="text-caption text-grey-5 q-mb-xs">Tags</div>
          <InlineEditableTags
            v-model="universe.tags"
            @update:modelValue="updateField('tags', $event)"
          />
        </div>
      </div>
    </q-card>

    <!-- Meta Panel -->
    <UniverseMetaPanel
      :tags="universe.tags"
      :visibility="universe.visibility"
      :created-at="universe.created_at"
      :story-count="stories.length"
      :character-count="characters.length"
      :lore-count="lore.length"
    />

    <!-- Dashboard Navigation -->
    <div class="row q-gutter-md q-mt-xl">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <DashboardLinkCard
          title="Stories"
          subtitle="Write and organize story arcs"
          icon="sym_o_menu_book"
          @click="$router.push(`/universe/${universe.id}/stories`)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <DashboardLinkCard
          title="Characters"
          subtitle="Manage your cast of legends"
          icon="sym_o_face"
          @click="$router.push(`/universe/${universe.id}/characters`)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <DashboardLinkCard
          title="Lore"
          subtitle="Define the rules, relics, and history"
          icon="sym_o_auto_stories"
          @click="$router.push(`/universe/${universe.id}/lore`)"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <DashboardLinkCard
          title="Maps"
          subtitle="Explore and link locations"
          icon="sym_o_map"
          @click="$router.push(`/universe/${universe.id}/map`)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/boot/supabase'
import { updateUniverse } from '@/supabase/universes'

import DashboardHeader from '@/components/universe/dashboard/DashboardHeader.vue'
import UniverseMetaPanel from '@/components/universe/dashboard/UniverseMetaPanel.vue'
import DashboardLinkCard from '@/components/universe/dashboard/DashboardLinkCard.vue'
import InlineEditableText from '@/components/universe/dashboard/InlineEditableText.vue'
import InlineEditableTags from '@/components/universe/dashboard/InlineEditableTags.vue'

const route = useRoute()
const universeId = route.params.id
const universe = ref({})
const stories = ref([])
const characters = ref([])
const lore = ref([])

onMounted(async () => {
  const { data: u } = await supabase.from('universes').select('*').eq('id', universeId).single()
  const { data: s } = await supabase.from('stories').select('id').eq('universe_id', universeId)
  const { data: c } = await supabase.from('characters').select('id').eq('universe_id', universeId)
  const { data: l } = await supabase.from('lore_entries').select('id').eq('universe_id', universeId)

  universe.value = u
  stories.value = s || []
  characters.value = c || []
  lore.value = l || []
})

async function updateField(field, value) {
  universe.value[field] = value
  await updateUniverse(universeId, { [field]: value })
}

function confirmDelete() {
  // placeholder for delete modal
  console.log('confirm delete universe', universeId)
}
</script>
