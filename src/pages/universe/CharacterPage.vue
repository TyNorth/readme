<template>
  <q-page class="q-pa-md character-detail-page">
    <!-- Header Section -->
    <div class="hero-section row items-center q-gutter-xl">
      <div class="portrait-frame">
        <q-img
          v-if="character?.portrait_url"
          :src="character.portrait_url"
          alt="portrait"
          ratio="2/3"
          class="portrait-img"
        />
        <div v-else class="portrait-placeholder flex flex-center column">
          <q-icon name="sym_o_face" size="56px" color="grey-6" />
          <div class="text-caption text-grey-5">No portrait</div>
        </div>
      </div>

      <div class="column flex justify-between">
        <div class="text-h4 text-shimmer">{{ character?.name }}</div>
        <div class="text-subtitle2 text-italic text-grey-5">{{ character?.alias }}</div>

        <div class="q-mt-sm row q-gutter-sm">
          <q-chip
            v-for="tag in character?.tags || []"
            :key="tag"
            dense
            color="primary"
            text-color="white"
            icon="sym_o_loyalty"
          >
            {{ tag }}
          </q-chip>
        </div>
      </div>
    </div>

    <!-- Voice Sample -->
    <q-card flat bordered class="q-mt-md q-pa-md bg-grey-9 text-white text-center">
      <template v-if="character?.voice_sample_url">
        <audio controls :src="character?.voice_sample_url" />
      </template>
      <template v-else>
        <q-icon name="sym_o_volume_off" size="md" class="q-mb-sm text-grey-5" />
        <div class="text-caption text-grey-5">No voice sample available</div>
      </template>
    </q-card>

    <!-- Bio Section -->
    <q-card flat bordered class="q-pa-md q-my-md bg-grey-9 text-white">
      <div class="text-subtitle2 text-gold q-mb-sm">Biography</div>
      <div class="text-body2 text-grey-4" style="white-space: pre-line">
        {{ character?.bio || "This character's backstory is still unfolding..." }}
      </div>
    </q-card>

    <q-card v-if="quote" flat bordered class="q-pa-md bg-grey-9 text-gold text-italic q-mt-md">
      “{{ quote }}”
    </q-card>

    <!-- Origin, Role, Relationships -->
    <q-card flat bordered class="q-pa-md q-my-md bg-grey-10 text-white">
      <div class="q-gutter-md row">
        <div class="col-12 col-sm-4">
          <div class="text-subtitle2 text-gold q-mb-sm">Origin</div>
          <div class="text-body2">{{ character?.origin_location || 'Unknown' }}</div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="text-subtitle2 text-gold q-mb-sm">Role</div>
          <div class="text-body2">{{ character?.role_rank || 'Hero/Wizard' }}</div>
          <!-- Placeholder -->
        </div>

        <div class="col-12 col-sm-4">
          <div class="text-subtitle2 text-gold q-mb-sm">Relationships</div>
          <div v-if="relationships.length">
            <div v-for="(rel, i) in relationships" :key="i" class="text-caption q-mb-xs">
              <strong>{{ rel.target }}</strong> — {{ rel.type }}
            </div>
          </div>
          <div v-else class="text-grey-5">None recorded.</div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/boot/supabase'

const route = useRoute()
const characterId = route.params.characterId
const character = ref(null)
const quote = ref(null)

const loadQuote = async () => {
  const { data, error } = await supabase
    .from('chapter_lines')
    .select('text')
    .eq('speaker_id', characterId)
    .limit(1)

  if (!error && data?.length) {
    quote.value = data[0].text
  } else {
    console.log(`no data`)
  }
}

const relationships = computed(() => {
  return character.value?.relationships || []
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single()

  if (!error) character.value = data
  await loadQuote()
})
</script>

<style scoped>
.character-detail-page {
  background-color: var(--q-dark-page);
  color: white;
}

.character-detail-page {
  background-color: var(--q-dark-page);
  color: white;
}
.hero-section {
  margin-bottom: 2rem;
}
.portrait-frame {
  width: 160px;
  height: 240px;
  overflow: hidden;
  border-radius: 12px;
  border: 2px solid var(--q-primary);
  background: rgba(255, 255, 255, 0.04);
}
.portrait-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.portrait-placeholder {
  height: 100%;
  background-color: #1e1e1e;
  border-radius: inherit;
  padding: 1rem;
}
</style>
