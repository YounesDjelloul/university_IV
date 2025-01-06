<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
  labels: props.data.map(d => d.region),
  datasets: [
    {
      label: 'Tweet Count',
      data: props.data.map(d => d.tweet_count),
      backgroundColor: props.data.map(d => {
        // Color based on sentiment
        const hue = 120 * d.sentiment // 0 = red, 120 = green
        return `hsla(${hue}, 70%, 50%, 0.8)`
      }),
      borderWidth: 1,
      borderColor: '#fff'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Tweets'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        afterLabel: function(context) {
          const sentiment = props.data[context.dataIndex].sentiment
          return `Sentiment: ${(sentiment * 100).toFixed(1)}% positive`
        }
      }
    }
  }
}
</script>

<template>
  <div class="chart">
    <Bar
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>