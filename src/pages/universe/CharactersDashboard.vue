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

    <CharacterListView v-if="viewMode === 'list'" :characters="characters" @edit="openEditDrawer" />
    <EditCharacterDrawer
      v-model="editDrawerOpen"
      :character="selectedCharacter"
      @updated="handleUpdated"
    />

    <CharacterCardGridView v-if="viewMode === 'card'" :characters="characters" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        aria-label="Create New Character"
        icon="sym_o_person_add"
        color="primary"
        @click="drawerOpen = true"
      />
    </q-page-sticky>
    <CreateCharacterDrawer v-model="drawerOpen" @created="characters.push($event)" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/boot/supabase'
import CreateCharacterDrawer from 'src/components/universe/dashboard/CreateCharacterDrawer.vue'
import EditCharacterDrawer from 'src/components/universe/dashboard/EditCharacterDrawer.vue'
import CharacterListView from '@/components/universe/dashboard/CharacterListView.vue'
import CharacterCardGridView from '@/components/universe/dashboard/CharacterCardGridView.vue'

const route = useRoute()
const universeId = route.params.id

const characters = ref([])
const loading = ref(false)
const viewMode = ref('list')
const drawerOpen = ref(false)
const editDrawerOpen = ref(false)
const selectedCharacter = ref(null)

function openEditDrawer(character) {
  selectedCharacter.value = character
  editDrawerOpen.value = true
}

function handleUpdated(updated) {
  const i = characters.value.findIndex((c) => c.id === updated.id)
  if (i !== -1) characters.value[i] = updated
}

onMounted(async () => {
  loading.value = true
  const { data } = await supabase.from('characters').select('*').eq('universe_id', universeId)
  characters.value = data || []
  loading.value = false
})
</script>
