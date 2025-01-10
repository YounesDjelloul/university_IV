<!-- components/GeoHeatmap.vue -->
<template>
  <div class="chart-container h-full">
    <Bar
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {Bar} from 'vue-chartjs'
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
      borderColor: '#fff',
      maxBarThickness: 50  // Prevent bars from becoming too thick
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 20,
      bottom: 20
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'rgba(0,0,0,0.05)'
      },
      ticks: {
        font: {
          size: 12
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        afterLabel: function (context) {
          const sentiment = props.data[context.dataIndex].sentiment
          return `Sentiment: ${(sentiment * 100).toFixed(1)}% positive`
        }
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>