<template>
  <q-page class="q-pa-md">
    <DashboardHeader title="Universes Overview" subtitle="Manage all of your worlds." />

    <div class="q-gutter-lg column">
      <q-card
        v-if="!universeStore.hasUniverses && !universeStore.loading"
        flat
        class="bg-grey-9 text-center q-pa-xl"
      >
        <q-icon name="sym_o_public_off" size="48px" color="grey-6" />
        <div class="text-h6 text-grey-5 q-mt-md">No Universes Yet</div>
        <div class="text-caption text-grey-6 q-mb-lg">
          Ready to build a new world? Click the button below to start!
        </div>
        <q-btn
          color="primary"
          icon="sym_o_add"
          label="Create Your First Universe"
          @click="createDialogOpen = true"
        />
      </q-card>

      <div
        v-for="universe in universeStore.universes"
        :key="universe.id"
        class="bg-grey-10 q-pa-md rounded-borders"
      >
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

        <UniverseMetaPanel
          :tags="universe.tags"
          :visibility="universe.visibility"
          :created-at="universe.created_at"
          :story-count="counts[universe.id]?.storyCount || 0"
          :character-count="counts[universe.id]?.characterCount || 0"
          :lore-count="counts[universe.id]?.loreCount || 0"
        />

        <div class="row q-gutter-md q-mt-md">
          <DashboardLinkCard
            title="Overview"
            subtitle="Manage this world"
            icon="sym_o_space_dashboard"
            @click="$router.push(`/universe/${universe.id}/overview`)"
          />
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
            subtitle="Artifacts & history"
            icon="sym_o_auto_stories"
            @click="$router.push(`/universe/${universe.id}/lore`)"
          />
        </div>
      </div>
    </div>

    <div v-if="universeStore.loading" class="flex flex-center q-my-xl">
      <q-spinner size="32px" color="primary" />
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="sym_o_add" color="primary" @click="createDialogOpen = true" />
    </q-page-sticky>

    <CreateUniverseDialog v-model="createDialogOpen" @created="handleUniverseCreated" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue' // Import computed
import { useUniverseStore } from '@/stores/universe-store'
import { updateUniverse } from '@/supabase/universes'
import { supabase } from '@/boot/supabase'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useUserStore } from '@/stores/user-store' // Import user store if needed for ID

import DashboardHeader from '@/components/universe/dashboard/DashboardHeader.vue'
import UniverseMetaPanel from '@/components/universe/dashboard/UniverseMetaPanel.vue'
import DashboardLinkCard from '@/components/universe/dashboard/DashboardLinkCard.vue'
import InlineEditableText from '@/components/universe/dashboard/InlineEditableText.vue'
import InlineEditableTags from '@/components/universe/dashboard/InlineEditableTags.vue'
import CreateUniverseDialog from '@/components/universe/CreateUniverseDialog.vue'

const router = useRouter()
const universeStore = useUniverseStore()
const userStore = useUserStore() // Get user store instance
const counts = ref({})
const createDialogOpen = ref(false)

// Function to fetch counts (remains largely the same)
async function fetchCounts() {
  await Promise.all(
    universeStore.universes.map(async (universe) => {
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
}

onMounted(async () => {
  try {
    // Ensure user is loaded before fetching their universes
    await userStore.initialize() // Assuming you have an init function
    const userId = userStore.authUser?.id ?? router.currentRoute.value.params.user_id

    if (!userId) {
      Notify.create({ type: 'warning', message: 'Could not determine user ID. Please log in.' })
      return
    }

    // Fetch universes using the store action
    await universeStore.fetchUserUniverses(userId)
    // Fetch counts after universes are loaded
    await fetchCounts()
  } catch (error) {
    console.error('Error loading universes data:', error)
    Notify.create({ type: 'negative', message: `Error loading data: ${error.message}` })
  }
})

// Update field function (ensure it also updates the store or calls an update action)
async function updateField(id, field, value) {
  // Find index in the store's array
  const index = universeStore.universes.findIndex((u) => u.id === id)
  if (index !== -1) {
    // Update store (ideally via an action)
    universeStore.universes[index][field] = value
    // Call Supabase update
    await updateUniverse(id, { [field]: value })
    Notify.create({
      type: 'info',
      message: 'Universe updated.',
      position: 'bottom-right',
      timeout: 1500,
    })
  }
}

// Handle the 'created' event
function handleUniverseCreated(newUniverse) {
  // Add to the store (preferably via an action)
  universeStore.universes.push(newUniverse)
  // Initialize counts
  counts.value[newUniverse.id] = { storyCount: 0, characterCount: 0, loreCount: 0 }
}
</script>
