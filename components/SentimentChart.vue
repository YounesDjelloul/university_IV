<!-- components/SentimentChart.vue -->
<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <select
          v-model="selectedTimeframe"
          class="w-40 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="timeframeChanged"
      >
        <option value="day">Past 24 Hours</option>
        <option value="week">Past Week</option>
        <option value="month">Past Month</option>
        <option value="year">Past Year</option>
      </select>
    </div>

    <div class="flex-grow relative">
      <Line
          :data="chartData"
          :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {Line} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const props = defineProps<{
  data: any[]
}>()

const emit = defineEmits(['timeframe-changed'])

const selectedTimeframe = ref('day')

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  switch (selectedTimeframe.value) {
    case 'day':
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    case 'week':
      return date.toLocaleDateString([], {weekday: 'short', hour: '2-digit'})
    case 'month':
      return date.toLocaleDateString([], {month: 'short', day: 'numeric'})
    case 'year':
      return date.toLocaleDateString([], {month: 'short', day: 'numeric'})
    default:
      return date.toLocaleTimeString()
  }
}

const timeframeChanged = () => {
  emit('timeframe-changed', selectedTimeframe.value)
}

const chartData = computed(() => ({
  labels: props.data.map(d => formatTimestamp(d.timestamp)),
  datasets: [
    {
      label: 'Positive',
      data: props.data.map(d => d.sentiment.positive),
      borderColor: '#27ae60',
      backgroundColor: 'rgba(39, 174, 96, 0.1)',
      tension: 0.4
    },
    {
      label: 'Neutral',
      data: props.data.map(d => d.sentiment.neutral),
      borderColor: '#f1c40f',
      backgroundColor: 'rgba(241, 196, 15, 0.1)',
      tension: 0.4
    },
    {
      label: 'Negative',
      data: props.data.map(d => d.sentiment.negative),
      borderColor: '#c0392b',
      backgroundColor: 'rgba(192, 57, 43, 0.1)',
      tension: 0.4
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'rgba(0,0,0,0.05)'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 15
      }
    }
  }
}
</script>

<style scoped>

</style>