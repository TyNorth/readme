<template>
  <div class="q-pa-md bg-grey-9 text-white rounded-borders">
    <div class="row items-center q-gutter-md">
      <q-btn icon="sym_o_mic" color="red" round dense @click="startRecording" v-if="!recording" />
      <q-btn
        icon="sym_o_stop"
        color="primary"
        round
        dense
        @click="stopRecording"
        v-if="recording"
      />
      <div class="text-caption">{{ recording ? 'Recording...' : 'Idle' }}</div>
    </div>

    <div v-if="audioUrl" class="q-mt-md">
      <AudioPlayer :src="audioUrl" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AudioPlayer from './AudioPlayer.vue'

const recording = ref(false)
const audioUrl = ref(null)
let mediaRecorder,
  chunks = []

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  mediaRecorder = new MediaRecorder(stream)
  chunks = []

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' })
    audioUrl.value = URL.createObjectURL(blob)
  }

  mediaRecorder.start()
  recording.value = true
}

function stopRecording() {
  if (mediaRecorder && recording.value) {
    mediaRecorder.stop()
    recording.value = false
  }
}
</script>
