<template>
  <div class="row items-center q-gutter-md">
    <q-btn
      dense
      round
      :icon="playing ? 'sym_o_pause' : 'sym_o_play_arrow'"
      @click="toggle"
      color="primary"
    />

    <div class="text-caption text-white">
      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
    </div>

    <q-slider v-model="currentTime" :max="duration" @change="seek" color="primary" class="col" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { formatTime } from '@/utils/format'

const props = defineProps({
  audioUrl: String,
})

const currentTime = ref(0)
const duration = ref(0)
const playing = ref(false)
let audio = null

function toggle() {
  if (!audio) return
  playing.value ? audio.pause() : audio.play()
}

function seek(val) {
  if (audio) audio.currentTime = val
}

watch(
  () => props.audioUrl,
  async (newUrl) => {
    if (!newUrl) return
    audio = new Audio(newUrl)
    audio.addEventListener('loadedmetadata', () => {
      duration.value = audio.duration
    })
    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio.currentTime
    })
  },
)
</script>
