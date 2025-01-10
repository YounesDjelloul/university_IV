<script setup lang="ts">
import {ref, computed} from 'vue'
import type {DashboardData} from '~/utils/data_generator'

const sections = [
  {id: 'metrics', label: 'Key Metrics'},
  {id: 'sentiment', label: 'Sentiment'},
  {id: 'emotions', label: 'Emotions'},
  {id: 'topics', label: 'Topics'},
  {id: 'geo', label: 'Geography'},
  {id: 'hashtags', label: 'Hashtags'},
  {id: 'tweets', label: 'Recent Tweets'}
]
const activeSections = ref(sections.map(s => s.id))
const toggleSection = (id: string) => {
  const index = activeSections.value.indexOf(id)
  if (index === -1) {
    activeSections.value.push(id)
  } else {
    activeSections.value.splice(index, 1)
  }
}

const isAutoUpdateEnabled = ref(true)
const toggleAutoUpdate = () => {
  isAutoUpdateEnabled.value = !isAutoUpdateEnabled.value
}

// Data management
const dashboardData = ref<DashboardData>(generateMockData())

const updateData = () => {
  const newData = generateMockData()

  const lastHourData = newData.hourlyData[newData.hourlyData.length - 1]
  dashboardData.value.hourlyData = [
    ...dashboardData.value.hourlyData.slice(1),
    {
      timestamp: new Date().toISOString(),
      sentiment: {
        positive: lastHourData.sentiment.positive + (Math.random() * 10 - 5),
        neutral: lastHourData.sentiment.neutral + (Math.random() * 10 - 5),
        negative: lastHourData.sentiment.negative + (Math.random() * 10 - 5)
      },
      emotions: {
        joy: lastHourData.emotions.joy + (Math.random() * 10 - 5),
        anger: lastHourData.emotions.anger + (Math.random() * 10 - 5),
        fear: lastHourData.emotions.fear + (Math.random() * 10 - 5),
        sadness: lastHourData.emotions.sadness + (Math.random() * 10 - 5),
        disgust: lastHourData.emotions.disgust + (Math.random() * 10 - 5)
      }
    }
  ]

  const newTweet = {
    id: `tweet_${Date.now()}`,
    text: `New sample tweet at ${new Date().toLocaleTimeString()} about ${
        ['campus events', 'research updates', 'student life', 'academic achievements', 'university sports'][
            Math.floor(Math.random() * 5)
            ]
    }`,
    created_at: new Date().toISOString(),
    sentiment_score: (Math.random() * 2 - 1).toFixed(2),
    subjectivity: Math.random().toFixed(2),
    emotion: ['joy', 'anger', 'fear', 'sadness', 'disgust'][Math.floor(Math.random() * 5)],
    public_metrics: {
      retweet_count: Math.floor(Math.random() * 100),
      reply_count: Math.floor(Math.random() * 50),
      like_count: Math.floor(Math.random() * 200),
      quote_count: Math.floor(Math.random() * 20)
    },
    user: {
      username: `user_${Math.floor(Math.random() * 1000)}`,
      followers_count: Math.floor(Math.random() * 10000),
      verified: Math.random() > 0.9
    }
  }
  dashboardData.value.recentTweets = [newTweet, ...dashboardData.value.recentTweets.slice(0, -1)]

  dashboardData.value.geoData = dashboardData.value.geoData.map(region => ({
    ...region,
    sentiment: Number((region.sentiment + (Math.random() * 0.2 - 0.1)).toFixed(2)),
    tweet_count: Math.max(50, region.tweet_count + Math.floor(Math.random() * 21 - 10))
  }))

  dashboardData.value.topicClusters = dashboardData.value.topicClusters.map(topic => ({
    ...topic,
    count: topic.count + Math.floor(Math.random() * 21 - 10),
    sentiment: Number((topic.sentiment + (Math.random() * 0.2 - 0.1)).toFixed(2))
  }))

  const shouldAddNewHashtag = Math.random() > 0.7
  if (shouldAddNewHashtag) {
    const newHashtags = [
      '#universitylife', '#campusevents', '#research', '#academics',
      '#studentlife', '#unilife', '#campuslife', '#studentsuccess',
      '#universityresearch', '#highered'
    ]
    const newHashtag = newHashtags[Math.floor(Math.random() * newHashtags.length)]

    if (!dashboardData.value.current.trending_hashtags.find(h => h.tag === newHashtag)) {
      dashboardData.value.current.trending_hashtags.pop() // Remove last hashtag
      dashboardData.value.current.trending_hashtags.unshift({
        tag: newHashtag,
        count: Math.floor(Math.random() * 50) + 50
      })
    }
  }

  dashboardData.value.current.trending_hashtags = dashboardData.value.current.trending_hashtags
      .map(hashtag => ({
        ...hashtag,
        count: Math.max(50, hashtag.count + Math.floor(Math.random() * 21 - 10))
      }))
      .sort((a, b) => b.count - a.count)

  dashboardData.value.current = {
    ...dashboardData.value.current,
    total_tweets: dashboardData.value.current.total_tweets + Math.floor(Math.random() * 50 + 10),
    average_sentiment: Number((
        dashboardData.value.current.average_sentiment + (Math.random() * 0.1 - 0.05)
    ).toFixed(2))
  }
}

let updateInterval: NodeJS.Timer | null = null

onMounted(() => {
  updateInterval = setInterval(() => {
    if (isAutoUpdateEnabled.value) {
      updateData()
    }
  }, 5000)
})

const currentEmotions = computed(() =>
    dashboardData.value.hourlyData[dashboardData.value.hourlyData.length - 1].emotions
)

const recentTweetsLimited = computed(() =>
    dashboardData.value.recentTweets.slice(0, 3)
)

const keyMetrics = computed(() => [
  {
    icon: '📊',
    value: dashboardData.value.current.total_tweets,
    label: 'Total Tweets'
  },
  {
    icon: '😊',
    value: `${(dashboardData.value.current.average_sentiment * 100).toFixed(1)}%`,
    label: 'Positive Sentiment'
  },
  {
    icon: '🔥',
    value: dashboardData.value.current.trending_hashtags[0].tag,
    label: 'Top Hashtag'
  },
  {
    icon: '⚡',
    value: dashboardData.value.recentTweets[0].public_metrics.like_count,
    label: 'Most Liked'
  }
])
</script>

<template>
  <div class="dashboard bg-gray-100 h-screen p-4">
    <!-- Top Controls -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex space-x-2">
        <button
            v-for="section in sections"
            :key="section.id"
            @click="toggleSection(section.id)"
            :class="[
            'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
            activeSections.includes(section.id)
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          ]"
        >
          {{ section.label }}
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Auto-update:</span>
        <button
            @click="toggleAutoUpdate"
            :class="[
            'px-3 py-1 rounded-lg text-sm font-medium',
            isAutoUpdateEnabled
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-600'
          ]"
        >
          {{ isAutoUpdateEnabled ? 'On' : 'Off' }}
        </button>
      </div>
    </div>

    <!-- Main Grid Layout -->
    <div class="grid grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
      <!-- Left Column: Key Metrics -->
      <div class="col-span-3 space-y-4">
        <div v-if="activeSections.includes('metrics')"
             class="bg-white rounded-lg p-4 shadow-sm">
          <div class="grid grid-rows-4 gap-4">
            <div v-for="metric in keyMetrics"
                 :key="metric.label"
                 class="flex items-center p-2 bg-gray-50 rounded-lg">
              <div class="text-2xl mr-3">{{ metric.icon }}</div>
              <div>
                <div class="text-lg font-semibold">{{ metric.value }}</div>
                <div class="text-sm text-gray-600">{{ metric.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Column: Main Charts -->
      <div class="col-span-6 space-y-4">
        <div v-if="activeSections.includes('sentiment')"
             class="bg-white rounded-lg p-4 shadow-sm h-1/2">
          <SentimentChart :data="dashboardData.hourlyData"/>
        </div>
        <div class="grid grid-cols-2 gap-4 h-1/2">
          <div v-if="activeSections.includes('emotions')"
               class="bg-white rounded-lg p-4 shadow-sm">
            <EmotionChart :data="currentEmotions"/>
          </div>
          <div v-if="activeSections.includes('topics')"
               class="bg-white rounded-lg p-4 shadow-sm">
            <TopicBubbleChart :data="dashboardData.topicClusters"/>
          </div>
        </div>
      </div>

      <!-- Right Column: Additional Insights -->
      <div class="col-span-3 space-y-4">
        <div v-if="activeSections.includes('geo')"
             class="bg-white rounded-lg p-4 shadow-sm">
          <GeoHeatmap :data="dashboardData.geoData"/>
        </div>
        <div v-if="activeSections.includes('hashtags')"
             class="bg-white rounded-lg p-4 shadow-sm">
          <HashtagCloud :hashtags="dashboardData.current.trending_hashtags"/>
        </div>
        <div v-if="activeSections.includes('tweets')"
             class="bg-white rounded-lg p-4 shadow-sm overflow-hidden">
          <div class="space-y-2">
            <div v-for="tweet in recentTweetsLimited"
                 :key="tweet.id"
                 class="p-2 text-sm bg-gray-50 rounded">
              <div class="font-medium">@{{ tweet.user.username }}</div>
              <div class="text-gray-600">{{ tweet.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@use '/assets/scss/dashboard.scss';

.dashboard {
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}
</style>