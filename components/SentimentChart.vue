<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
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

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => ({
  labels: props.data.map(d => new Date(d.timestamp).toLocaleTimeString()),
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
      stacked: false
    }
  },
  plugins: {
    title: {
      display: false
    },
    legend: {
      position: 'bottom'
    }
  }
}
</script>


<template>
  <div class="chart">
    <Line
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>