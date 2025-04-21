<template>
  <q-drawer side="right" v-model="model" overlay class="themed-drawer text-white">
    <ThemedDrawerHeader title="Edit Character" @close="model = false" />

    <q-scroll-area class="q-pa-md" style="height: calc(100% - 50px)">
      <q-form @submit.prevent="submit" class="q-gutter-md">
        <ThemedSection title="Basics" icon="sym_o_face">
          <ThemedInput v-model="form.name" label="Name" />
          <ThemedInput v-model="form.alias" label="Alias" />
          <ThemedInput v-model="form.origin_location" label="Origin" />
          <ThemedInput v-model="form.role_rank" label="Role / Rank" />
        </ThemedSection>

        <ThemedSection title="Tags" icon="sym_o_style">
          <ThemedSelect
            v-model="form.tags"
            label="Tags"
            multiple
            use-input
            new-value-mode="add-unique"
            :options="[]"
          />
        </ThemedSection>

        <ThemedSection title="Portrait Image" icon="sym_o_image">
          <ThemedUploadBtn
            v-model="portraitFile"
            :preview-url="form.portrait_url"
            accept="image/*"
            label="Portrait"
            upload-label="Upload Portrait"
            @clear="clearPortrait"
          />
        </ThemedSection>

        <ThemedSection title="Voice Sample" icon="sym_o_record_voice_over">
          <ThemedUploadBtn
            v-model="voiceFile"
            :preview-url="form.voice_sample_url"
            accept="audio/*"
            label="Voice Sample"
            upload-label="Upload Voice"
            @clear="clearVoice"
          />
        </ThemedSection>

        <ThemedSection title="Biography" icon="sym_o_auto_stories">
          <ThemedTextarea v-model="form.bio" label="Biography" />
        </ThemedSection>

        <ThemedSubmitBar
          label="Save Changes"
          :loading="loading"
          @submit="submit"
          @cancel="model = false"
        />
      </q-form>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/boot/supabase'
import { updateCharacter } from '@/supabase/characters'

import ThemedInput from 'src/elements/common/ThemedInput.vue'
import ThemedSelect from 'src/elements/common/ThemedSelect.vue'
import ThemedSection from 'src/elements/common/ThemedSection.vue'
import ThemedTextarea from 'src/elements/common/ThemedTextarea.vue'
import ThemedUploadBtn from 'src/elements/common/ThemedUploadBtn.vue'
import ThemedDrawerHeader from 'src/elements/common/ThemedDrawerHeader.vue'
import ThemedSubmitBar from 'src/elements/common/ThemedSubmitBar.vue'

const model = defineModel()
const props = defineProps({ character: Object })
const emit = defineEmits(['updated'])

const form = ref({ ...props.character })
const portraitFile = ref(null)
const voiceFile = ref(null)
const loading = ref(false)

watch(
  () => props.character,
  (val) => {
    form.value = { ...val }
  },
)

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

    const updated = await updateCharacter(form.value.id, form.value)
    emit('updated', updated)
    model.value = false
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
