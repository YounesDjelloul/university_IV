<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

const debug = ref(true)
const chartContainer = ref(null)
let simulation = null

const createBubbleChart = () => {
  if (!chartContainer.value || !props.data.length) return

  d3.select(chartContainer.value).selectAll('svg').remove()

  const margin = {top: 20, right: 20, bottom: 20, left: 20}
  const width = chartContainer.value.clientWidth - margin.left - margin.right
  const height = 300 - margin.top - margin.bottom

  const svg = d3.select(chartContainer.value)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

  const maxCount = d3.max(props.data, d => d.count)
  const minCount = d3.min(props.data, d => d.count)

  const radiusScale = d3.scaleSqrt()
      .domain([minCount, maxCount])
      .range([20, 60])

  const colorScale = d3.scaleLinear()
      .domain([0, 0.5, 1])
      .range(['#c0392b', '#f1c40f', '#27ae60'])

  const nodes = props.data.map(d => ({
    ...d,
    radius: radiusScale(d.count),
    x: Math.random() * width,
    y: Math.random() * height
  }))

  simulation = d3.forceSimulation(nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('collision', d3.forceCollide().radius(d => d.radius + 2))
      .on('tick', ticked)

  const bubbles = svg.selectAll('.bubble')
      .data(nodes)
      .join('g')
      .attr('class', 'bubble')
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('transform', `translate(${d.x},${d.y}) scale(1.1)`)
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('transform', `translate(${d.x},${d.y}) scale(1)`)
      })

  bubbles.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => colorScale(d.sentiment))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

  bubbles.append('text')
      .text(d => d.topic)
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', '#fff')
      .attr('font-size', d => `${Math.min(d.radius / 3, 14)}px`)
      .style('pointer-events', 'none')

  bubbles.append('text')
      .text(d => d.count)
      .attr('text-anchor', 'middle')
      .attr('dy', '1.5em')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .style('pointer-events', 'none')

  function ticked() {
    bubbles.attr('transform', d => {
      d.x = Math.max(d.radius, Math.min(width - d.radius, d.x))
      d.y = Math.max(d.radius, Math.min(height - d.radius, d.y))
      return `translate(${d.x},${d.y})`
    })
  }
}

// Handle window resize
const handleResize = () => {
  if (simulation) {
    simulation.stop()
  }
  createBubbleChart()
}

onMounted(() => {
  createBubbleChart()
  window.addEventListener('resize', handleResize)
})

watch(() => props.data, (newData) => {
  if (simulation) {
    simulation.stop()
  }
  createBubbleChart()
}, {deep: true})

onUnmounted(() => {
  if (simulation) {
    simulation.stop()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="chartContainer" class="chart relative">
    <div v-if="debug" class="absolute top-0 right-0 text-xs text-gray-500">
      Topics loaded: {{ data.length }}
    </div>
  </div>
</template>


<style scoped>
.chart {
  width: 100%;
  height: 300px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}
</style>