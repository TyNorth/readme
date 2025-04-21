<template>
  <q-drawer side="right" v-model="model" overlay class="text-white themed-drawer">
    <ThemedDrawerHeader title="Create Character" @close="model = false" />

    <q-scroll-area class="q-pa-md" style="height: calc(100% - 50px)">
      <q-form @submit.prevent="submit" class="q-gutter-md">
        <ThemedSection title="Basic Info" icon="sym_o_face">
          <ThemedInput v-model="form.name" label="Name" />
          <ThemedInput v-model="form.alias" label="Alias" />
          <ThemedInput v-model="form.origin_location" label="Origin" />
          <ThemedInput v-model="form.role_rank" label="Role / Rank" />
        </ThemedSection>

        <ThemedSection title="Tags" icon="sym_o_style">
          <ThemedSelect
            v-model="form.tags"
            :options="[]"
            use-input
            multiple
            new-value-mode="add-unique"
            input-debounce="300"
          />
        </ThemedSection>

        <ThemedSection title="Portrait Image" icon="sym_o_image">
          <div v-if="form.portrait_url" class="q-mb-sm">
            <q-img :src="form.portrait_url" style="max-height: 200px" />
          </div>

          <ThemedUploadBtn
            v-model="portraitFile"
            :preview-url="form.portrait_url"
            accept="image/*"
            upload-label="Upload Portrait"
            @clear="clearPortrait"
          />

          <q-btn
            v-if="form.portrait_url"
            flat
            dense
            color="negative"
            icon="sym_o_delete"
            label="Remove Portrait"
            @click="clearPortrait"
            class="q-mt-sm"
          />
        </ThemedSection>

        <ThemedSection title="Voice Sample" icon="sym_o_record_voice_over">
          <div v-if="form.voice_sample_url" class="q-mb-sm">
            <audio :src="form.voice_sample_url" controls />
          </div>

          <ThemedUploadBtn
            v-model="voiceFile"
            :preview-url="form.voice_sample_url"
            accept="audio/*"
            upload-label="Upload Voice"
            @clear="clearVoice"
          />

          <q-btn
            v-if="form.voice_sample_url"
            flat
            dense
            color="negative"
            icon="sym_o_delete"
            label="Remove Voice Sample"
            @click="clearVoice"
            class="q-mt-sm"
          />
        </ThemedSection>

        <ThemedSection title="Biography" icon="sym_o_auto_stories">
          <ThemedTextArea v-model="form.bio" />
        </ThemedSection>

        <ThemedSubmitBar label="Create Character" :loading="loading" @submit="submit" />
      </q-form>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/boot/supabase'
import { createCharacter } from '@/supabase/characters'

import ThemedInput from 'src/elements/common/ThemedInput.vue'
import ThemedSection from 'src/elements/common/ThemedSection.vue'
import ThemedSelect from 'src/elements/common/ThemedSelect.vue'
import ThemedTextArea from 'src/elements/common/ThemedTextArea.vue'
import ThemedUploadBtn from 'src/elements/common/ThemedUploadBtn.vue'
import ThemedDrawerHeader from 'src/elements/common/ThemedDrawerHeader.vue'
import ThemedSubmitBar from 'src/elements/common/ThemedSubmitBar.vue'

const model = defineModel()
const emit = defineEmits(['created'])

const route = useRoute()
const universeId = route.params.id
const loading = ref(false)

const form = ref({
  name: '',
  alias: '',
  origin_location: '',
  role_rank: '',
  tags: [],
  bio: '',
  portrait_url: '',
  voice_sample_url: '',
  universe_id: universeId,
})

const portraitFile = ref(null)
const voiceFile = ref(null)

function clearPortrait() {
  form.value.portrait_url = ''
  portraitFile.value = null
}

function clearVoice() {
  form.value.voice_sample_url = ''
  voiceFile.value = null
}

async function uploadFile(bucket, file) {
  const filename = `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from(bucket).upload(filename, file)
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}

async function submit() {
  loading.value = true
  try {
    if (portraitFile.value) {
      form.value.portrait_url = await uploadFile('portraits', portraitFile.value)
    }
    if (voiceFile.value) {
      form.value.voice_sample_url = await uploadFile('voice_samples', voiceFile.value)
    }

    const created = await createCharacter(form.value)
    emit('created', created)
    model.value = false
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.themed-drawer {
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.02), transparent),
    linear-gradient(to bottom, #1a1b1d, #141516);
  border-left: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 20px rgba(255, 215, 100, 0.05);
  transition: all 0.3s ease;
}

.q-toolbar {
  background-color: #1c1d20;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Spectral', serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.q-scroll-area {
  padding: 1rem;
}
</style>
