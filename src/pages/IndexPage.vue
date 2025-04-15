<template>
  <q-page class="q-pa-md text-white">
    <div class="q-mb-lg text-h4 text-gold">
      Welcome{{ user?.username ? `, ${user.username}` : '' }}
    </div>

    <q-card flat class="q-pa-md bg-grey-9 rounded-borders q-mb-lg">
      <div class="row items-center q-gutter-md">
        <q-icon name="sym_o_lightbulb" color="primary" size="32px" />
        <div>
          <div class="text-h6">Create Worlds. Tell Stories. Share Lore.</div>
          <div class="text-caption text-grey-4">
            Explore the magic of interactive storytelling and collaborative worldbuilding.
          </div>
        </div>
      </div>
    </q-card>

    <!-- Mode Toggle Display -->
    <div class="row items-center q-gutter-sm q-mb-md" v-if="user">
      <div class="text-caption text-grey-4">Mode:</div>
      <q-toggle
        v-model="creatorMode"
        label="Creator Mode"
        color="primary"
        @update:model-value="userStore.setCreatorMode"
      />
    </div>

    <!-- Conditional content -->
    <div v-if="creatorMode">
      <div class="text-subtitle1 text-gold q-mb-sm">Your Creative Tools</div>
      <q-card
        flat
        class="q-pa-md du-card q-mb-md"
        :style="
          tool.image
            ? `background-image: url('${tool.image}'); background-size: 100vw 600px;
background-repeat: no-repeat; background-position: center;`
            : ''
        "
        v-for="tool in creatorTiles"
        :key="tool.title"
        @click="$router.push(tool.to)"
        clickable
      >
        <div class="row items-center q-gutter-md">
          <q-icon :name="`sym_o_${tool.icon}`" size="28px" />
          <div>
            <div class="text-h5">{{ tool.title }}</div>
            <div class="text-subtitle1 text-grey-4">{{ tool.desc }}</div>
          </div>
        </div>
      </q-card>
    </div>

    <div v-else>
      <div class="text-subtitle1 text-gold q-mb-sm">Discover Universes</div>
      <q-card
        flat
        class="q-pa-md q-mb-md du-card"
        :style="
          explore.image
            ? `background-image: url('${explore.image}'); background-size: 100vw 600px;
background-repeat: no-repeat; background-position: center;`
            : ''
        "
        v-for="explore in readerTiles"
        :key="explore.title"
        @click="$router.push(explore.to)"
        clickable
      >
        <div class="row items-center q-gutter-md">
          <q-icon :name="`sym_o_${explore.icon}`" size="28px" />
          <div>
            <div class="text-h5">{{ explore.title }}</div>
            <div class="text-subtitle1 text-grey-4">{{ explore.desc }}</div>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user-store'

const userStore = useUserStore()
const user = computed(() => userStore.profile)
const userId = ref()
const creatorMode = computed({
  get: () => userStore.creatorMode,
  set: (val) => userStore.setCreatorMode(val),
})

const creatorTiles = ref([
  {
    title: 'My Universes',
    icon: 'hub',
    to: `/my-universes/${userId.value}`,
    desc: 'Manage your worlds and collaborators.',
    image: '/src/assets/images/saved_moments.png',
  },
  {
    title: 'Create New Story',
    icon: 'edit_note',
    to: '/universe-select',
    desc: 'Start writing or add new entries.',
    image: '/src/assets/images/saved_moments.png',
  },
  {
    title: 'Drafts & Edits',
    icon: 'drafts',
    to: '/drafts',
    desc: 'Continue writing or polish your work.',
    image: '/src/assets/images/saved_moments.png',
  },
])

const readerTiles = [
  {
    title: 'Explore Worlds',
    icon: 'explore',
    to: '/explore',
    desc: 'Browse universes, stories, and lore.',
    image: '/src/assets/images/saved_moments.png',
  },
  {
    title: 'Continue Reading',
    icon: 'menu_book',
    to: '/read-latest',
    desc: 'Pick up where you left off.',
    image: '/src/assets/images/continue_reading.png',
  },
  {
    title: 'Saved Moments',
    icon: 'bookmark',
    to: '/bookmarks',
    desc: 'Revisit your highlights and notes.',
    image: '/src/assets/images/saved_moments.png',
  },
]

onMounted(async () => {
  await userStore.initialize()
  console.log(userStore.authUser.id)
  userId.value = computed(() => {
    return userStore.authUser.id
  })
})
</script>
<style lang="scss">
.du-card {
  min-height: 250px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition:
    transform 0.4s ease-in-out,
    translate 0.4s ease-in-out;
}
.du-card:hover {
  transform: scale(1.01);
  translate: 0% 2%;
}
</style>
