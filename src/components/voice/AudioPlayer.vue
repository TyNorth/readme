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

const props = defineProps({ src: String })

const audio = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const playing = ref(false)

function toggle() {
  if (!audio.value) return
  playing.value ? audio.value.pause() : audio.value.play()
}

function seek(val) {
  if (audio.value) audio.value.currentTime = val
}

watch(
  () => props.src,
  (newUrl) => {
    if (!newUrl) return
    audio.value = new Audio(newUrl)
    audio.value.addEventListener('loadedmetadata', () => {
      duration.value = audio.value.duration
    })
    audio.value.addEventListener('timeupdate', () => {
      currentTime.value = audio.value.currentTime
    })
  },
)
</script>
