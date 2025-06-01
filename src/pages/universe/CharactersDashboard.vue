<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-gold">Characters</div>
      <q-btn-toggle
        v-model="viewMode"
        dense
        flat
        toggle-color="primary"
        :options="[
          { value: 'list', icon: 'sym_o_view_list' },
          { value: 'card', icon: 'sym_o_view_module' },
        ]"
      />
    </div>

    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner size="32px" color="primary" />
    </div>

    <div v-else-if="!loading && characters.length === 0" class="text-center q-pa-xl">
      <q-icon name="sym_o_no_accounts" size="48px" color="grey-6" />
      <div class="text-h6 text-grey-5 q-mt-md">No Characters Yet</div>
      <div class="text-caption text-grey-6 q-mb-lg">
        Start by adding your first character to this universe!
      </div>
      <q-btn
        color="primary"
        icon="sym_o_person_add"
        label="Create First Character"
        @click="drawerOpen = true"
      />
    </div>

    <template v-else>
      <CharacterListView
        v-if="viewMode === 'list'"
        :characters="characters"
        @edit="openEditDrawer"
        @view-character="viewCharacterDetails"
      />
      <CharacterCardGridView
        v-if="viewMode === 'card'"
        :characters="characters"
        @edit="openEditDrawer"
        @view-character="viewCharacterDetails"
      />
    </template>

    <EditCharacterDrawer
      v-model="editDrawerOpen"
      :character="selectedCharacter"
      @updated="handleCharacterUpdated"
    />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        aria-label="Create New Character"
        icon="sym_o_person_add"
        color="primary"
        @click="drawerOpen = true"
      />
    </q-page-sticky>

    <CreateCharacterDrawer
      v-model="drawerOpen"
      :universe-id="universeId"
      :creator-id="creatorId"
      @created="handleCharacterCreated"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router' // Added useRouter
import { supabase } from '@/boot/supabase'
import { Notify } from 'quasar' // For error notifications
import CreateCharacterDrawer from 'src/components/universe/dashboard/CreateCharacterDrawer.vue'
import EditCharacterDrawer from 'src/components/universe/dashboard/EditCharacterDrawer.vue'
import CharacterListView from '@/components/universe/dashboard/CharacterListView.vue'
import CharacterCardGridView from '@/components/universe/dashboard/CharacterCardGridView.vue'
import { useUserStore } from 'src/stores/user-store'

const route = useRoute()
const router = useRouter() // Initialize router
const universeId = route.params.id

const characters = ref([])
const loading = ref(false)
const viewMode = ref('list') // Default view mode

const drawerOpen = ref(false) // For CreateCharacterDrawer
const editDrawerOpen = ref(false) // For EditCharacterDrawer
const selectedCharacter = ref(null)
const creatorId = ref(null)
function openEditDrawer(character) {
  selectedCharacter.value = character
  editDrawerOpen.value = true
}

function handleCharacterUpdated(updatedCharacter) {
  const index = characters.value.findIndex((c) => c.id === updatedCharacter.id)
  if (index !== -1) {
    characters.value[index] = updatedCharacter
  }
  Notify.create({ type: 'positive', message: 'Character updated!' })
}

function handleCharacterCreated(newCharacter) {
  characters.value.unshift(newCharacter) // Add to the beginning of the list for immediate visibility
  Notify.create({ type: 'positive', message: 'Character created!' })
}

// Example function if your list/card views emit an event to navigate to character details
function viewCharacterDetails(character) {
  // Assuming your route for character details is like /universe/:universeId/character/:characterId
  // This matches the CharacterPage.vue route we discussed
  router.push(`/universe/${universeId}/character/${character.id}`)
}

onMounted(async () => {
  loading.value = true
  creatorId.value = useUserStore().authUser.id
  console.log(creatorId.value)
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('universe_id', universeId)
      .order('created_at', { ascending: false }) // Optional: order by creation date or name

    if (error) throw error
    characters.value = data || []
  } catch (err) {
    console.error('Error fetching characters:', err)
    Notify.create({
      type: 'negative',
      message: `Failed to load characters: ${err.message}`,
    })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Add any specific styles for your dashboard here */
.text-gold {
  color: #c49a43; /* Or your theme's gold color */
}
</style>
