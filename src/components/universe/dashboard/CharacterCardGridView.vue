<template>
  <div class="row q-col-gutter-md q-gutter-md">
    <div v-for="char in characters" :key="char.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
      <q-card
        flat
        bordered
        class="char-card cursor-pointer bg-grey-9 text-white"
        @click="$router.push(`/universe/${char.universe_id}/character/${char.id}`)"
      >
        <q-img :src="char.portrait_url" :alt="char.name" ratio="2/3" class="rounded-borders">
          <div class="absolute-bottom text-subtitle2 bg-dark text-white text-center q-pa-sm">
            {{ char.name }}
            <div class="text-caption text-grey-4">{{ char.alias }}</div>
          </div>
        </q-img>
      </q-card>
    </div>
  </div>
</template>

<script setup>
defineProps({
  characters: Array,
})
</script>

<style scoped>
.char-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.char-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
</style>
