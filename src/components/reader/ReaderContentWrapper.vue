<template>
  <div :class="['reader-wrapper', computedClasses]">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props to control style
const props = defineProps({
  fontSize: { type: String, default: 'md' },
  fontFamily: { type: String, default: 'serif' },
  lineHeight: { type: String, default: 'normal' },
  highContrast: { type: Boolean, default: false },
  theme: { type: String, default: 'dark' }, // or 'light'
})

const computedClasses = computed(() => [
  `font-${props.fontSize}`,
  `font-${props.fontFamily}`,
  `lh-${props.lineHeight}`,
  props.highContrast ? 'contrast-high' : '',
  props.theme === 'light' ? 'theme-light' : 'theme-dark',
])
</script>

<style scoped lang="scss">
.reader-wrapper {
  transition: all 0.3s ease;
}

.font-sm {
  font-size: 0.85rem;
}
.font-md {
  font-size: 1rem;
}
.font-lg {
  font-size: 1.25rem;
}
.font-xl {
  font-size: 1.5rem;
}

.font-serif {
  font-family: 'Spectral', serif;
}
.font-sans {
  font-family: 'Open Sans', sans-serif;
}

.lh-normal {
  line-height: 1.5;
}
.lh-relaxed {
  line-height: 1.75;
}
.lh-loose {
  line-height: 2;
}

.contrast-high {
  color: #ffffff !important;
  background-color: #000000 !important;
}

.theme-light {
  background-color: #fdfdfc;
  color: #111;
}

.theme-dark {
  background-color: #121212;
  color: #eaeaea;
}
</style>
