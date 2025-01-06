<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const emotionColors = {
  joy: '#27ae60',
  anger: '#c0392b',
  fear: '#8e44ad',
  sadness: '#2980b9',
  disgust: '#d35400'
}

const chartData = computed(() => ({
  labels: Object.keys(props.data),
  datasets: [{
    data: Object.values(props.data),
    backgroundColor: Object.keys(props.data).map(emotion => emotionColors[emotion]),
    borderWidth: 2
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 15
      }
    }
  },
  cutout: '65%',
  radius: '90%'
}
</script>

<template>
  <div class="chart">
    <Doughnut
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>