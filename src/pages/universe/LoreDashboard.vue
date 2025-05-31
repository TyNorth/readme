<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4 text-gold">Lore Compendium</div>
      <q-btn-toggle
        v-model="viewMode"
        dense
        flat
        toggle-color="primary"
        :options="[
          { value: 'list', icon: 'sym_o_view_list' },
          { value: 'cards', icon: 'sym_o_grid_view' },
        ]"
      />
    </div>

    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner-puff color="primary" size="3em" />
    </div>

    <div v-else-if="!loading && loreEntries.length === 0" class="text-center q-pa-xl">
      <q-icon name="sym_o_menu_book" size="48px" color="grey-6" />
      <div class="text-h6 text-grey-5 q-mt-md">No Lore Entries Yet</div>
      <div class="text-caption text-grey-6 q-mb-lg">
        This is where the chronicles of your universe will unfold. Start by adding your first piece
        of lore!
      </div>
      <q-btn
        color="primary"
        icon="sym_o_add_circle"
        label="Create First Lore Entry"
        @click="createDrawerOpen = true"
      />
    </div>

    <q-list
      bordered
      separator
      v-if="viewMode === 'list' && loreEntries.length > 0"
      :class="$q.dark.isActive ? 'bg-grey-9' : ''"
    >
      <q-item v-for="entry in loreEntries" :key="entry.id">
        <q-item-section avatar>
          <q-icon :name="getLoreIcon(entry.type)" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ entry.title }}</q-item-label>
          <q-item-label caption lines="2">{{
            entry.summary || 'No summary provided.'
          }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-chip
            dense
            outline
            :color="getLoreTypeColor(entry.type)"
            :label="entry.type || 'General'"
            size="sm"
            class="q-mb-xs"
          />
          <div class="text-caption text-grey">
            {{ formatDate(entry.updated_at || entry.created_at) }}
          </div>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            dense
            round
            icon="sym_o_edit"
            @click="openEditDrawer(entry)"
            aria-label="Edit"
          />
          <q-btn
            flat
            dense
            round
            icon="sym_o_visibility"
            @click="viewLoreEntry(entry)"
            aria-label="View"
          />
          <q-btn
            flat
            dense
            round
            icon="sym_o_delete"
            color="negative"
            @click="confirmDeleteLore(entry)"
            aria-label="Delete"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <div v-if="viewMode === 'cards' && loreEntries.length > 0" class="row q-col-gutter-md">
      <div v-for="entry in loreEntries" :key="entry.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card flat bordered :class="$q.dark.isActive ? 'bg-grey-9' : ''">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">{{ entry.title }}</div>
                <div class="text-subtitle2">
                  <q-icon :name="getLoreIcon(entry.type)" color="primary" class="q-mr-xs" />
                  {{ entry.type || 'General' }}
                </div>
              </div>
              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="sym_o_more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable @click="viewLoreEntry(entry)">
                        <q-item-section avatar><q-icon name="sym_o_visibility" /></q-item-section>
                        <q-item-section>View</q-item-section>
                      </q-item>
                      <q-item clickable @click="openEditDrawer(entry)">
                        <q-item-section avatar><q-icon name="sym_o_edit" /></q-item-section>
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item clickable @click="confirmDeleteLore(entry)">
                        <q-item-section avatar
                          ><q-icon name="sym_o_delete" color="negative"
                        /></q-item-section>
                        <q-item-section class="text-negative">Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <p class="text-caption ellipsis-3-lines">
              {{
                entry.summary ||
                entry.content.substring(0, 150) + (entry.content.length > 150 ? '...' : '') ||
                'No details.'
              }}
            </p>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <div class="text-caption text-grey q-mr-sm">
              Last updated: {{ formatDate(entry.updated_at || entry.created_at) }}
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="sym_o_add_circle" color="primary" @click="createDrawerOpen = true" />
    </q-page-sticky>

    <CreateLoreEntryDrawer
      v-model="createDrawerOpen"
      :universe-id="universeId"
      @created="handleLoreCreated"
    />
    <EditLoreEntryDrawer
      v-model="editDrawerOpen"
      :lore-entry-to-edit="selectedLoreEntry"
      @updated="handleLoreUpdated"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/boot/supabase'
import { Notify, Dialog, date } from 'quasar'
import CreateLoreEntryDrawer from 'src/components/universe/dashboard/CreateLoreEntryDrawer.vue'
import EditLoreEntryDrawer from 'src/components/universe/dashboard/EditLoreEntryDrawer.vue' // Ensure path is correct

const route = useRoute()
const router = useRouter()
const universeId = route.params.id

const loreEntries = ref([])
const loading = ref(true)
const viewMode = ref('list') // Default view: 'list' or 'cards'

const createDrawerOpen = ref(false)
const editDrawerOpen = ref(false)
const selectedLoreEntry = ref(null)

// Helper for icons based on lore type
const getLoreIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'history':
      return 'sym_o_history_edu'
    case 'location':
      return 'sym_o_public'
    case 'character arcana':
      return 'sym_o_person'
    case 'item':
      return 'sym_o_diamond'
    case 'event':
      return 'sym_o_event'
    case 'concept':
      return 'sym_o_psychology'
    case 'organization':
      return 'sym_o_corporate_fare'
    case 'species':
      return 'sym_o_emoji_nature'
    case 'culture':
      return 'sym_o_museum'
    default:
      return 'sym_o_auto_stories' // Default lore icon
  }
}
const getLoreTypeColor = (type) => {
  if (type)
    // You can define specific colors for types
    return 'primary'
}

function formatDate(timestamp) {
  return date.formatDate(timestamp, 'MMM DD, YYYY HH:mm')
}

async function fetchLoreEntries() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('lore_entries')
      .select('*')
      .eq('universe_id', universeId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    loreEntries.value = data || []
  } catch (err) {
    console.error('Error fetching lore entries:', err)
    Notify.create({ type: 'negative', message: `Failed to load lore: ${err.message}` })
  } finally {
    loading.value = false
  }
}

function handleLoreCreated(newLore) {
  loreEntries.value.unshift(newLore) // Add to top for immediate visibility
  Notify.create({ type: 'positive', message: 'Lore entry created!' })
}

function openEditDrawer(loreEntry) {
  selectedLoreEntry.value = { ...loreEntry } // Pass a copy to avoid direct mutation issues
  editDrawerOpen.value = true
}

function handleLoreUpdated(updatedLore) {
  const index = loreEntries.value.findIndex((l) => l.id === updatedLore.id)
  if (index !== -1) {
    loreEntries.value[index] = updatedLore
  }
  Notify.create({ type: 'positive', message: 'Lore entry updated!' })
}

function viewLoreEntry(loreEntry) {
  router.push(`/universe/${universeId}/lore/${loreEntry.id}`)
}

function confirmDeleteLore(loreEntry) {
  Dialog.create({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete the lore entry "${loreEntry.title}"? This action cannot be undone.`,
    cancel: true,
    persistent: true,
    ok: { label: 'Delete', color: 'negative' },
    dark: true, // Assuming a dark theme
    class: 'bg-grey-9',
  }).onOk(async () => {
    deleteLoreEntry(loreEntry.id, loreEntry.title)
  })
}

async function deleteLoreEntry(loreId, loreTitle) {
  try {
    const { error } = await supabase.from('lore_entries').delete().eq('id', loreId)

    if (error) throw error

    loreEntries.value = loreEntries.value.filter((l) => l.id !== loreId)
    Notify.create({ type: 'positive', message: `Lore entry "${loreTitle}" deleted.` })
  } catch (err) {
    console.error('Error deleting lore entry:', err)
    Notify.create({ type: 'negative', message: `Failed to delete lore: ${err.message}` })
  }
}

onMounted(fetchLoreEntries)
</script>

<style scoped>
.text-gold {
  color: #c49a43; /* Or your theme's gold color */
}
.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4em; /* Adjust based on font size */
  max-height: calc(1.4em * 3); /* line-height * number of lines */
}
</style>
