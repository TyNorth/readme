<template>
  <div ref="canvas" class="relative-position" style="width: 100%; height: 500px; overflow: hidden">
    <q-img
      :src="map.image_url"
      style="width: 100%; height: 100%; object-fit: cover"
      spinner-color="primary"
    >
      <template v-for="(spot, i) in map.hotspots" :key="i">
        <MapMarker
          :x="spot.x"
          :y="spot.y"
          :label="spot.label"
          @click="$emit('marker-click', spot)"
        />
      </template>
    </q-img>
  </div>
</template>

<script setup>
import MapMarker from './MapMarker.vue'
defineProps({ map: Object })
defineEmits(['marker-click'])
</script>
