<template>
  <q-page class="q-pa-md">
    <DashboardHeader title="Universes Overview" subtitle="Manage all of your worlds." />

    <div class="q-gutter-lg column">
      <div
        v-for="universe in universes"
        :key="universe.id"
        class="bg-grey-10 q-pa-md rounded-borders"
      >
        <!-- Editable Info -->
        <div class="q-gutter-md q-mb-md">
          <div>
            <div class="text-caption text-grey-5 q-mb-xs">Title</div>
            <InlineEditableText
              v-model="universe.title"
              @update:modelValue="(val) => updateField(universe.id, 'title', val)"
            />
          </div>
          <div>
            <div class="text-caption text-grey-5 q-mb-xs">Summary</div>
            <InlineEditableText
              v-model="universe.summary"
              @update:modelValue="(val) => updateField(universe.id, 'summary', val)"
            />
          </div>
          <div>
            <div class="text-caption text-grey-5 q-mb-xs">Tags</div>
            <InlineEditableTags
              v-model="universe.tags"
              @update:modelValue="(val) => updateField(universe.id, 'tags', val)"
            />
          </div>
        </div>

        <!-- Meta Panel -->
        <UniverseMetaPanel
          :tags="universe.tags"
          :visibility="universe.visibility"
          :created-at="universe.created_at"
          :story-count="counts[universe.id]?.storyCount || 0"
          :character-count="counts[universe.id]?.characterCount || 0"
          :lore-count="counts[universe.id]?.loreCount || 0"
        />

        <!-- Section Links -->
        <div class="row q-gutter-md q-mt-md">
          <DashboardLinkCard
            title="Stories"
            subtitle="Write and organize"
            icon="sym_o_menu_book"
            @click="$router.push(`/universe/${universe.id}/stories`)"
          />
          <DashboardLinkCard
            title="Characters"
            subtitle="Manage your cast"
            icon="sym_o_face"
            @click="$router.push(`/universe/${universe.id}/characters`)"
          />
          <DashboardLinkCard
            title="Lore"
            subtitle="Artifacts, history, and rules"
            icon="sym_o_auto_stories"
            @click="$router.push(`/universe/${universe.id}/lore`)"
          />
          <DashboardLinkCard
            title="Maps"
            subtitle="Explore your world"
            icon="sym_o_map"
            @click="$router.push(`/universe/${universe.id}/map`)"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUniverseStore } from '@/stores/universe-store'
import { updateUniverse } from '@/supabase/universes'
import { supabase } from '@/boot/supabase'
import { useRouter } from 'vue-router'

import DashboardHeader from '@/components/universe/dashboard/DashboardHeader.vue'
import UniverseMetaPanel from '@/components/universe/dashboard/UniverseMetaPanel.vue'
import DashboardLinkCard from '@/components/universe/dashboard/DashboardLinkCard.vue'
import InlineEditableText from '@/components/universe/dashboard/InlineEditableText.vue'
import InlineEditableTags from '@/components/universe/dashboard/InlineEditableTags.vue'

const router = useRouter()
const universeStore = useUniverseStore()
const universes = ref([])
const counts = ref({}) // keyed by universe.id

onMounted(async () => {
  const userId = router.currentRoute.value.params.user_id
  await universeStore.fetchUserUniverses(userId)
  universes.value = universeStore.universes

  await Promise.all(
    universes.value.map(async (universe) => {
      const [s, c, l] = await Promise.all([
        supabase
          .from('stories')
          .select('id', { count: 'exact', head: true })
          .eq('universe_id', universe.id),
        supabase
          .from('characters')
          .select('id', { count: 'exact', head: true })
          .eq('universe_id', universe.id),
        supabase
          .from('lore_entries')
          .select('id', { count: 'exact', head: true })
          .eq('universe_id', universe.id),
      ])
      counts.value[universe.id] = {
        storyCount: s.count || 0,
        characterCount: c.count || 0,
        loreCount: l.count || 0,
      }
    }),
  )
})

async function updateField(id, field, value) {
  const universe = universes.value.find((u) => u.id === id)
  if (universe) {
    universe[field] = value
    await updateUniverse(id, { [field]: value })
  }
}
</script>
