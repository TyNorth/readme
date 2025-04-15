<template>
  <q-dialog v-model="model" persistent>
    <q-card class="bg-dark text-white rounded-borders" style="min-width: 340px; max-width: 440px">
      <q-card-section>
        <div class="text-h5 text-gold">Reader Options</div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="q-gutter-md column q-ma-sm">
        <!-- Font Size -->
        <q-select
          dark
          v-model="options.fontSize"
          :options="[
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Extra Large', value: 'xl' },
          ]"
          label="Font Size"
          dense
          filled
          class="full-width"
        />

        <!-- Font Style -->
        <div class="text-subtitle2 text-gold q-mb-xs">Font Style</div>
        <q-btn-toggle
          v-model="options.fontFamily"
          :options="[
            { label: 'Serif', value: 'serif' },
            { label: 'Sans', value: 'sans' },
          ]"
          toggle-color="primary"
          unelevated
          spread
        />

        <!-- Line Height -->
        <q-select
          dark
          v-model="options.lineHeight"
          :options="[
            { label: 'Normal', value: 'normal' },
            { label: 'Relaxed', value: 'relaxed' },
            { label: 'Loose', value: 'loose' },
          ]"
          label="Line Height"
          dense
          filled
          class="full-width"
        />

        <!-- Audio Speed -->
        <div>
          <div class="text-subtitle2 text-gold q-mb-xs">Audio Speed</div>
          <q-btn-toggle
            v-model="options.audioSpeed"
            :options="[
              { label: '0.75x', value: 0.75 },
              { label: '1x', value: 1.0 },
              { label: '1.25x', value: 1.25 },
              { label: '1.5x', value: 1.5 },
            ]"
            toggle-color="primary"
            unelevated
            dense
            spread
          />
        </div>

        <!-- Toggle Row -->
        <div class="row q-gutter-sm q-mt-md">
          <q-toggle
            v-model="options.highContrast"
            label="High Contrast"
            color="amber"
            dense
            class="col-12 col-sm-6"
          />
          <q-toggle
            v-model="options.immersionMode"
            label="Immersion Mode"
            color="primary"
            dense
            class="col-12 col-sm-6"
          />
          <q-toggle
            v-model="options.theme"
            true-value="dark"
            false-value="light"
            label="Dark Mode"
            color="primary"
            dense
            class="col-12 col-sm-6"
          />
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions align="right" class="q-pa-md flex justify-between">
        <q-btn flat label="Reset" color="warning" @click="reset" icon="sym_o_restart_alt" />
        <q-btn
          flat
          label="Close"
          color="primary"
          v-close-popup
          @click="persist"
          icon="sym_o_cancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useReaderOptionsStore } from '@/stores/reader-options-store'
import { watch } from 'vue'

const model = defineModel()
const store = useReaderOptionsStore()

// Persist on each change (per field)
watch(() => store.fontSize, store.persist)
watch(() => store.fontFamily, store.persist)
watch(() => store.lineHeight, store.persist)
watch(() => store.audioSpeed, store.persist)
watch(() => store.highContrast, store.persist)
watch(() => store.immersionMode, store.persist)
watch(() => store.theme, store.persist)

const options = computed({
  get: () => store.$state,
  set: (val) => Object.assign(store, val),
})

function persist() {
  store.persist()
}

function reset() {
  store.reset()
}
</script>
