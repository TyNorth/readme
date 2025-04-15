<template>
  <div class="character-card" @mousemove="handleMouseMove" @mouseleave="resetTilt">
    <div class="card-inner" :class="{ flipped: isFlipped }">
      <!-- FRONT SIDE -->
      <div class="card-face front">
        <q-card
          flat
          bordered
          class="rounded-borders full-height cursor-pointer"
          @click="goToProfile"
        >
          <div class="column items-center q-pa-md">
            <div class="badge-banner absolute-top-left q-ma-sm">{{ badge }}</div>

            <q-avatar size="72px" class="q-mb-sm avatar-frame" :class="{ 'no-image': !portrait }">
              <img v-if="portrait" :src="portrait" :alt="name" />
              <q-icon v-else name="sym_o_face" size="36px" color="grey-5" />
            </q-avatar>

            <div class="text-h6 text-gold">{{ name }}</div>
            <div class="text-caption text-grey-4 text-italic q-mb-sm">{{ alias }}</div>

            <div class="row justify-center q-gutter-xs q-mt-xs">
              <q-chip
                v-for="tag in tags"
                :key="tag"
                dense
                size="sm"
                color="primary"
                text-color="white"
                icon="sym_o_loyalty"
              >
                {{ tag }}
              </q-chip>
            </div>
          </div>

          <q-btn
            flat
            dense
            round
            icon="sym_o_sync_alt"
            size="sm"
            class="absolute-bottom-right q-ma-sm"
            @click.stop="isFlipped = true"
          />
        </q-card>
      </div>

      <!-- BACK SIDE -->
      <div class="card-face back">
        <q-card
          flat
          bordered
          class="bg-grey-9 text-white rounded-borders full-height cursor-pointer"
        >
          <div class="column q-pa-md justify-between" style="height: 100%">
            <div>
              <div class="text-subtitle2 text-gold q-mb-sm">Bio</div>
              <div class="text-caption text-grey-4 scroll" style="max-height: 140px">
                {{ bio || 'No background provided yet.' }}
              </div>
            </div>

            <q-btn
              flat
              dense
              round
              icon="sym_o_sync_alt"
              size="sm"
              class="q-mt-md self-end"
              @click.stop="isFlipped = false"
            />
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  name: String,
  alias: String,
  portrait: String,
  tags: Array,
  bio: String,
  badge: String,
  universeId: String,
  characterId: String,
})

const isFlipped = ref(false)
const router = useRouter()

function goToProfile() {
  router.push(`/universe/${props.universeId}/character/${props.characterId}`)
}

function handleMouseMove(e) {
  const card = e.currentTarget.querySelector('.card-inner')
  const rect = card.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -12
  const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 12
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

function resetTilt(e) {
  const card = e.currentTarget.querySelector('.card-inner')
  card.style.transform = 'rotateX(0deg) rotateY(0deg)'
}
</script>
<style scoped>
.character-card {
  perspective: 1000px;
  width: 100%;
  max-width: 300px;
  min-height: 200px;
}
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
  transform-style: preserve-3d;
}
.card-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  backface-visibility: hidden;
}
.front {
  z-index: 2;
}
.back {
  transform: rotateY(180deg);
}
.card-inner.flipped {
  transform: rotateY(180deg);
}

.avatar-frame {
  border: 2px solid var(--q-primary);
  border-radius: 50%;
  padding: 2px;
  background-color: rgba(255, 255, 255, 0.05);
}
.badge-banner {
  font-size: 0.7rem;
  background: var(--q-primary);
  padding: 2px 6px;
  border-radius: 6px;
  color: white;
}
</style>
