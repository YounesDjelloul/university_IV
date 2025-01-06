<script setup>
import { ref, computed } from 'vue'
import { generateMockData } from '~/utils/data_generator.ts'

const data = ref(generateMockData())

const mostEngagedTweet = computed(() => {
  return data.value.recentTweets.reduce((max, tweet) => {
    return tweet.public_metrics.like_count > max.public_metrics.like_count ? tweet : max
  }, data.value.recentTweets[0])
})

const emotionData = computed(() => {
  return data.value.hourlyData[data.value.hourlyData.length - 1].emotions
})

const getSentimentClass = (score) => {
  if (score > 0.3) return 'sentiment--positive'
  if (score < -0.3) return 'sentiment--negative'
  return 'sentiment--neutral'
}

const getSentimentEmoji = (score) => {
  if (score > 0.3) return '😊'
  if (score < -0.3) return '😞'
  return '😐'
}

onMounted(() => {
  setInterval(() => {
    data.value = generateMockData()
  }, 30000)
})
</script>

<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h1>Albukhary International University</h1>
      <p>Real-time university social media sentiment analysis</p>
    </header>

    <main class="dashboard__content">
      <div class="card card--full">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="metric">
            <div class="metric__icon">📊</div>
            <div>
              <div class="metric__value">{{ data.current.total_tweets }}</div>
              <div class="metric__label">Total Tweets Today</div>
            </div>
          </div>

          <div class="metric">
            <div class="metric__icon">😊</div>
            <div>
              <div class="metric__value">
                {{ (data.current.average_sentiment * 100).toFixed(1) }}%
              </div>
              <div class="metric__label">Positive Sentiment</div>
            </div>
          </div>

          <div class="metric">
            <div class="metric__icon">🔥</div>
            <div>
              <div class="metric__value">
                {{ data.current.trending_hashtags[0].tag }}
              </div>
              <div class="metric__label">Top Trending Hashtag</div>
            </div>
          </div>

          <div class="metric">
            <div class="metric__icon">⚡</div>
            <div>
              <div class="metric__value">
                {{ mostEngagedTweet.public_metrics.like_count }}
              </div>
              <div class="metric__label">Most Liked Tweet</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card card--full">
        <h2 class="card__header">Sentiment Trend</h2>
        <SentimentChart :data="data.hourlyData" />
      </div>

      <div class="card card--full">
        <h2 class="card__header">Emotion Distribution</h2>
        <EmotionChart :data="emotionData" />
      </div>

      <div class="card card--full">
        <h2 class="card__header">Recent Tweets</h2>
        <div class="space-y-4">
          <div v-for="tweet in data.recentTweets.slice(0, 5)"
               :key="tweet.id"
               class="p-4 rounded-lg bg-gray-50">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-semibold">@{{ tweet.user.username }}</span>
              <span v-if="tweet.user.verified" class="text-blue-500">✓</span>
            </div>
            <p>{{ tweet.text }}</p>
            <div class="mt-2 flex gap-4 text-sm text-gray-600">
              <span>🔄 {{ tweet.public_metrics.retweet_count }}</span>
              <span>💬 {{ tweet.public_metrics.reply_count }}</span>
              <span>❤️ {{ tweet.public_metrics.like_count }}</span>
              <span :class="getSentimentClass(tweet.sentiment_score)">
                {{ getSentimentEmoji(tweet.sentiment_score) }}
                {{ tweet.sentiment_score }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="card__header">Topic Clusters</h2>
        <TopicBubbleChart :data="data.topicClusters" />
      </div>

      <div class="card">
        <h2 class="card__header">Geographic Distribution</h2>
        <GeoHeatmap :data="data.geoData" />
      </div>

      <div class="card">
        <h2 class="card__header">Trending Hashtags</h2>
        <HashtagCloud :hashtags="data.current.trending_hashtags" />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
@use '/assets/scss/dashboard.scss';
</style>