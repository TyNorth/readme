<template>
  <div>
    <!-- Mini Progress Bar -->
    <q-linear-progress
      v-if="isPlaying"
      :value="progress"
      color="primary"
      class="q-mb-md"
      size="6px"
    />

    <!-- Line Loop -->
    <div
      v-for="(line, index) in lines"
      :key="line.id"
      ref="lineRefs"
      class="q-pa-md q-mb-sm rounded-borders transition-all"
      :class="[
        'text-white bg-grey-9',
        activeIndex === index ? 'active-line' : '',
        getLineColorClass(line),
      ]"
    >
      <div class="text-subtitle2 q-mb-xs">
        {{ getSpeakerName(line) }}
      </div>

      <div class="text-body2 q-mb-xs">{{ line.text }}</div>

      <div class="row items-center q-gutter-sm">
        <q-btn
          icon="sym_o_play_arrow"
          color="primary"
          round
          dense
          @click="playLine(index)"
          v-if="activeIndex !== index"
        />
        <q-btn
          icon="sym_o_pause"
          color="primary"
          round
          dense
          @click="pausePlayback"
          v-if="activeIndex === index && isPlaying"
        />
        <div v-if="activeIndex === index" class="text-caption text-grey-5">
          {{ formatTime(elapsed) }}
        </div>
      </div>
    </div>

    <!-- Auto-advance toggle -->
    <div v-if="lines.length > 1" class="q-mt-md">
      <q-toggle v-model="autoPlay" label="Auto-advance" color="primary" dense />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  lines: Array,
  characters: Array,
  chapterId: String,
  storyId: String,
})

function getSpeakerName(line) {
  if (!line.speaker_id) return 'Narrator'
  const char = props.characters.find((c) => c.id === line.speaker_id)
  return char?.alias || char?.name || 'Unknown'
}

function getLineColorClass(line) {
  if (!line.speaker_id) return 'line-narrator'
  const char = props.characters.find((c) => c.id === line.speaker_id)
  if (!char) return ''
  const hash = [...char.name].reduce((a, c) => a + c.charCodeAt(0), 0)
  const colors = ['line-blue', 'line-violet', 'line-green', 'line-amber', 'line-teal']
  return colors[hash % colors.length]
}

const lineRefs = ref([])
const activeIndex = ref(null)
const isPlaying = ref(false)
const autoPlay = ref(true)
const elapsed = ref(0)
const progress = ref(0)
let audio = null
let interval = null

function playLine(index) {
  const line = props.lines[index]
  if (!line?.audio_url) return

  stopAudio()

  audio = new Audio(line.audio_url)
  activeIndex.value = index
  isPlaying.value = true
  elapsed.value = 0
  progress.value = 0
  audio.play()

  interval = setInterval(() => {
    elapsed.value = Math.floor(audio.currentTime)
    progress.value = audio.currentTime / audio.duration
  }, 200)

  audio.addEventListener('ended', () => {
    stopAudio()
    if (autoPlay.value && index + 1 < props.lines.length) {
      playLine(index + 1)
    }
  })

  savePlayback(index)

  // scroll into view after DOM updates
  nextTick(() => {
    lineRefs.value[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

function pausePlayback() {
  if (audio) {
    audio.pause()
    isPlaying.value = false
  }
}

function stopAudio() {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
    audio = null
  }
  clearInterval(interval)
  isPlaying.value = false
  progress.value = 0
  elapsed.value = 0
}

function savePlayback(index) {
  const key = `story:${props.storyId}:chapter:${props.chapterId}`
  localStorage.setItem(key, index.toString())
}

function loadPlayback() {
  const key = `story:${props.storyId}:chapter:${props.chapterId}`
  const stored = localStorage.getItem(key)
  if (stored !== null) {
    const i = parseInt(stored)
    if (!isNaN(i) && i < props.lines.length) {
      activeIndex.value = i
    }
  }
}

onUnmounted(() => stopAudio())
watch(
  () => props.chapterId,
  () => {
    activeIndex.value = null
    loadPlayback()
  },
)
loadPlayback()
function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}
</script>

<style scoped>
.active-line {
  border-left: 3px solid var(--q-primary);
  box-shadow: 0 0 12px rgba(255, 215, 100, 0.15);
}
.line-blue {
  border-left-color: #3e8ed0;
}
.line-violet {
  border-left-color: #8568a4;
}
.line-green {
  border-left-color: #49a078;
}
.line-amber {
  border-left-color: #e6b554;
}
.line-teal {
  border-left-color: #3d9d93;
}
.line-narrator {
  border-left-color: #888;
}
</style>
