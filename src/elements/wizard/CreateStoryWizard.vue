<template>
  <q-dialog v-model="open" persistent transition-show="fade" transition-hide="fade">
    <q-card class="themed-wizard bg-grey-10 text-white" style="max-width: 500px; width: 100%">
      <q-toolbar class="bg-grey-9">
        <q-toolbar-title>Create Story</q-toolbar-title>
        <q-btn icon="sym_o_close" flat round dense @click="open = false" />
      </q-toolbar>

      <q-card-section>
        <q-form @submit.prevent="submit" class="q-gutter-md">
          <ThemedInput v-model="form.title" label="Title" />
          <ThemedTextarea v-model="form.summary" label="Summary" />
          <ThemedSelect
            v-model="form.tags"
            label="Tags"
            multiple
            use-input
            new-value-mode="add-unique"
          />
          <q-select
            v-model="form.visibility"
            label="Visibility"
            filled
            dense
            :options="['draft', 'public']"
            class="themed-input"
          />
          <ThemedSubmitBar
            label="Create Story"
            :loading="loading"
            @submit="submit"
            @cancel="open = false"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/boot/supabase'
import ThemedInput from '@/elements/common/ThemedInput.vue'
import ThemedTextarea from '@/elements/common/ThemedTextarea.vue'
import ThemedSelect from '@/elements/common/ThemedSelect.vue'
import ThemedSubmitBar from '@/elements/common/ThemedSubmitBar.vue'
import { useRouter } from 'vue-router'
import { notifyError } from 'src/utils/notify'

const open = defineModel() // controlled from parent
const emit = defineEmits(['created'])

const form = ref({
  title: '',
  summary: '',
  tags: [],
  visibility: 'draft',
  universe_id: null, // must be passed in
})

const loading = ref(false)

const router = useRouter()

async function submit() {
  loading.value = true
  try {
    const { data, error } = await supabase.from('stories').insert([form.value]).select().single()

    if (error) {
      console.log(error)
      notifyError('Error creating story')
    }

    emit('created', data)
    open.value = false

    // 🔁 Navigate to story editor
    if (data.id) {
      router.push(`/editor/${data.id}`)
    } else {
      console.log(JSON.stringify(data))
    }
  } catch (err) {
    console.error('Create Story Error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.themed-wizard {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 14px rgba(255, 215, 100, 0.05);
}
</style>
