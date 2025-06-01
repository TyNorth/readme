<template>
  <q-page class="q-pa-md text-white">
    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <div>
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
      </div>
    </transition>

    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="row items-center q-gutter-sm q-mb-md" v-if="user">
        <div class="text-caption text-grey-4">Mode:</div>
        <q-toggle
          v-model="creatorMode"
          label="Creator Mode"
          color="primary"
          @update:model-value="userStore.setCreatorMode"
        />
      </div>
    </transition>

    <transition name="slide-fade" mode="out-in">
      <div v-if="creatorMode" key="creator-tools">
        <div class="text-subtitle1 text-gold q-mb-sm">Your Creative Tools</div>
        <transition-group
          appear
          tag="div"
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown"
          class="relative-position"
        >
          <q-card
            flat
            class="q-pa-md du-card q-mb-md relative-position"
            v-for="(tool, index) in creatorTiles"
            :key="tool.title"
            :style="[tileStyle(tool.image), { transitionDelay: `${index * 100}ms` }]"
            @click="handleTileClick(tool.to)"
            clickable
          >
            <div class="du-card-content-wrapper">
              <div class="row items-center q-gutter-md">
                <q-icon :name="`sym_o_${tool.icon}`" size="28px" class="du-card-icon" />
                <div>
                  <div class="text-h5 du-card-title">{{ tool.title }}</div>
                  <div class="text-subtitle1 text-grey-4 du-card-desc">{{ tool.desc }}</div>
                </div>
              </div>
            </div>
            <q-badge
              v-if="tool.comingSoon"
              color="amber-7"
              label="Coming Soon"
              floating
              class="du-card-badge"
            />
          </q-card>
        </transition-group>
      </div>

      <div v-else key="reader-tools">
        <div class="text-subtitle1 text-gold q-mb-sm">Discover Universes</div>
        <transition-group
          appear
          tag="div"
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown"
          class="relative-position"
        >
          <q-card
            flat
            class="q-pa-md q-mb-md du-card relative-position"
            v-for="(explore, index) in readerTiles"
            :key="explore.title"
            :style="[tileStyle(explore.image), { transitionDelay: `${index * 100}ms` }]"
            @click="handleTileClick(explore.to)"
            clickable
          >
            <div class="du-card-content-wrapper">
              <div class="row items-center q-gutter-md">
                <q-icon :name="`sym_o_${explore.icon}`" size="28px" class="du-card-icon" />
                <div>
                  <div class="text-h5 du-card-title">{{ explore.title }}</div>
                  <div class="text-subtitle1 text-grey-4 du-card-desc">{{ explore.desc }}</div>
                </div>
              </div>
            </div>
            <q-badge
              v-if="explore.comingSoon"
              color="amber-7"
              label="Coming Soon"
              floating
              class="du-card-badge"
            />
          </q-card>
        </transition-group>
      </div>
    </transition>
  </q-page>
</template>

<script setup>
// ... (your existing script setup remains largely the same) ...
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useUserStore } from '@/stores/user-store'

const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.profile)
const creatorMode = computed({
  get: () => userStore.creatorMode,
  set: (val) => userStore.setCreatorMode(val),
})

const userId = ref(null)

// Ensure image paths are correct relative to your `public` folder or are imported
const creatorTiles = ref([
  {
    title: 'My Universes',
    icon: 'hub',
    to: () => `/my-universes/${userId.value}`,
    desc: 'Manage your worlds and collaborators.',
    image: '/images/saved_moments.png', // Example image path
  },
  {
    title: 'Create New Story',
    icon: 'edit_note',
    to: '/universe-select',
    desc: 'Start writing or add new entries.',
    image: '/images/saved_moments.png', // Example image path
  },
  {
    title: 'Drafts & Edits',
    icon: 'drafts',
    to: '/drafts',
    desc: 'Continue writing or polish your work.',
    comingSoon: true,
    image: '/images/saved_moments.png', // Example image path
  },
])

const readerTiles = [
  {
    title: 'Explore Worlds',
    icon: 'explore',
    to: '/explore',
    desc: 'Browse universes, stories, and lore.',
    image: '/images/saved_moments.png', // Example image path
  },
  {
    title: 'Continue Reading',
    icon: 'menu_book',
    to: '/read-latest',
    desc: 'Pick up where you left off.',
    comingSoon: true,
    image: '/images/continue_reading.png', // Example image path
  },
  {
    title: 'Saved Moments',
    icon: 'bookmark',
    to: '/bookmarks',
    desc: 'Revisit your highlights and notes.',
    comingSoon: true,
    image: '/images/saved_moments.png', // Example image path
  },
]

const validRoutes = ['/explore', '/universe-select']

function tileStyle(image) {
  if (!image) return ''
  return {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${image}')`, // Added overlay
    backgroundSize: 'cover', // Changed for better responsiveness
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  }
}

function handleTileClick(target) {
  const path = typeof target === 'function' ? target() : target
  const isDynamicUserRoute = path.startsWith('/my-universes/') && userId.value
  const isValid = validRoutes.includes(path) || isDynamicUserRoute

  if (!isValid && (typeof target !== 'function' || !target().startsWith('/my-universes/'))) {
    // Avoid "coming soon" for valid dynamic routes even if userId is briefly null
    const tileData =
      creatorTiles.value.find(
        (t) => t.to === target || (typeof t.to === 'function' && t.to() === target),
      ) ||
      readerTiles.find((t) => t.to === target || (typeof t.to === 'function' && t.to() === target))

    if (tileData?.comingSoon) {
      Notify.create({
        type: 'info',
        message: 'This feature is coming soon!',
        icon: 'sym_o_info',
        position: 'bottom-right',
      })
      return
    }
  }
  // If it's a dynamic route that depends on userId, and userId is null, it's effectively "not ready"
  // but let initialize() handle it. The main "Coming Soon" is for explicitly marked tiles.
  if (!isValid && !path.startsWith('/my-universes/')) {
    // Re-check for explicit coming soon for non-dynamic routes
    Notify.create({
      type: 'info',
      message: 'This feature is coming soon!',
      icon: 'sym_o_info',
      position: 'bottom-right',
    })
    return
  }

  if (isValid || isDynamicUserRoute) {
    // Allow navigation if route is valid OR it's the dynamic user route (even if userId is briefly null, router guards will handle it)
    router.push(path)
  } else {
    // This case should ideally be caught by the comingSoon check above,
    // but as a fallback for unhandled non-valid routes:
    Notify.create({
      type: 'info',
      message: 'Feature not available yet.',
      icon: 'sym_o_info',
      position: 'bottom-right',
    })
  }
}

onMounted(async () => {
  await userStore.initialize()
  userId.value = userStore.authUser?.id
})
</script>

<style lang="scss" scoped>
// Quasar's Animate.css classes are used directly in the template
// e.g., animated fadeInDown. Make sure you have animate.css integrated if not using Quasar's default.
// If using Quasar's extras, these should work out of the box.

// Transition for mode switch
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease-out;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// Card Styling
.du-card {
  min-height: 200px; // Slightly reduced for potentially smaller images
  cursor: pointer;
  display: flex;
  align-items: flex-end; // Align content to bottom for better text visibility over image
  padding: 0; // Remove default padding, will add to content wrapper
  border-radius: 8px; // Softer radius
  overflow: hidden; // Important for background image and overlay
  color: white; // Ensure text is white against background images
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out; // Added box-shadow transition

  &:hover {
    transform: scale(1.03) translateY(-5px); // Enhanced hover
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.3),
      0 6px 6px rgba(0, 0, 0, 0.25); // Softer, more pronounced shadow
  }
}

.du-card-content-wrapper {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  width: 100%;
  padding: 16px; // Add padding here
  z-index: 1; // Ensure content is above pseudo-elements if any
}

.du-card-icon {
  // Optional: Add shadow to icon for better visibility
  // text-shadow: 0px 1px 3px rgba(0,0,0,0.5);
  color: var(--q-primary); // Make icon primary color
}

.du-card-title {
  font-weight: 500;
  // text-shadow: 0px 2px 4px rgba(0,0,0,0.7); // Text shadow for readability
}

.du-card-desc {
  // text-shadow: 0px 1px 3px rgba(0,0,0,0.6);
  opacity: 0.9;
}

.du-card-badge {
  // Custom styling for badge if needed, e.g.
  // background-color: rgba(255, 193, 7, 0.85) !important; // amber-7 with slight transparency
  // color: black !important;
  // font-weight: bold;
  // border-radius: 4px 0 4px 0;
  // padding: 4px 8px;
  // No need for transparent prop if you set background here
}

// For staggered list animations, Quasar's built-in animated classes with transition-group
// like "animated fadeInUp" are used. Ensure Quasar's animation CSS is included.
// The transition-delay is applied inline for staggering.
</style>
