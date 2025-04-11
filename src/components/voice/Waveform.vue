<template>
  <div ref="waveform" class="q-my-md" style="height: 80px"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import WaveSurfer from 'wavesurfer.js'

const props = defineProps({ src: String })
const waveform = ref(null)
let wave = null

onMounted(() => {
  wave = WaveSurfer.create({
    container: waveform.value,
    waveColor: '#ccc',
    progressColor: '#ffd700',
    height: 80,
    responsive: true,
  })
  if (props.src) wave.load(props.src)
})

watch(
  () => props.src,
  (newSrc) => {
    if (newSrc && wave) wave.load(newSrc)
  },
)
</script>
