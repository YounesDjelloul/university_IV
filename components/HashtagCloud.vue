<script setup>
import {defineProps, defineEmits} from 'vue'

const props = defineProps({
  hashtags: {
    type: Array,
    required: true
  }
})

defineEmits(['click'])

// Get relative size based on count
const getSize = (count) => {
  const max = Math.max(...props.hashtags.map(h => h.count))
  const min = Math.min(...props.hashtags.map(h => h.count))
  const scale = (count - min) / (max - min)
  return 0.8 + scale * 0.7 // Size between 0.8rem and 1.5rem
}

// Get color based on count
const getColor = (count) => {
  const max = Math.max(...props.hashtags.map(h => h.count))
  const min = Math.min(...props.hashtags.map(h => h.count))
  const scale = (count - min) / (max - min)
  // Color gradient from secondary to primary color
  return `hsl(${210 + scale * 20}, ${60 + scale * 20}%, ${45 + scale * 10}%)`
}
</script>

<template>
  <div class="h-full flex flex-col">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Trending Hashtags</h2>
    <div ref="cloudContainer" class="chart chart--small">
      <div class="flex flex-wrap gap-2 justify-center items-center h-full">
      <span
          v-for="hashtag in hashtags"
          :key="hashtag.tag"
          class="px-3 py-1 rounded-full text-white cursor-pointer transition-all duration-300 hover:scale-110"
          :style="{
          backgroundColor: getColor(hashtag.count),
          fontSize: `${getSize(hashtag.count)}rem`
        }"
          @click="$emit('click', hashtag)"
      >
        {{ hashtag.tag }}
      </span>
      </div>
    </div>
  </div>
</template>