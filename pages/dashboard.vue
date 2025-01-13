<script setup lang="ts">
import {ref, computed} from 'vue'
import type {DashboardData} from '~/utils/data_generator'

const sections = [
  {id: 'metrics', label: 'Key Metrics'},
  {id: 'engagement', label: 'Engagement Trends'},
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

const dashboardData = ref<DashboardData>(generateMockData())

const timeframeData = ref(generateTimeframeMockData('day'))
const currentTimeframe = ref('day')

const handleTimeframeChange = (newTimeframe) => {
  currentTimeframe.value = newTimeframe
  timeframeData.value = generateTimeframeMockData(newTimeframe)
}

const updateData = () => {
  const lastDataPoint = timeframeData.value[timeframeData.value.length - 1]

  const newPoint = {
    timestamp: new Date().toISOString(),
    sentiment: {
      positive: lastDataPoint.sentiment.positive + (Math.random() * 10 - 5),
      neutral: lastDataPoint.sentiment.neutral + (Math.random() * 10 - 5),
      negative: lastDataPoint.sentiment.negative + (Math.random() * 10 - 5)
    },
    emotions: {
      joy: lastDataPoint.emotions.joy + (Math.random() * 10 - 5),
      anger: lastDataPoint.emotions.anger + (Math.random() * 10 - 5),
      fear: lastDataPoint.emotions.fear + (Math.random() * 10 - 5),
      sadness: lastDataPoint.emotions.sadness + (Math.random() * 10 - 5),
      disgust: lastDataPoint.emotions.disgust + (Math.random() * 10 - 5)
    },
    engagement: {
      retweets: Math.max(0, lastDataPoint.engagement.retweets + Math.floor(Math.random() * 21 - 10)),
      likes: Math.max(0, lastDataPoint.engagement.likes + Math.floor(Math.random() * 31 - 15)),
      replies: Math.max(0, lastDataPoint.engagement.replies + Math.floor(Math.random() * 11 - 5))
    }
  }

  timeframeData.value = [...timeframeData.value.slice(1), newPoint]


  const lastHourData = dashboardData.value.hourlyData[dashboardData.value.hourlyData.length - 1];

  // Ensure lastHourData has engagement data or provide defaults
  const lastEngagement = lastHourData.engagement || {
    retweets: 50,
    likes: 100,
    replies: 20
  };

  // Update hourly data with incremental changes
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
      },
      engagement: {
        retweets: Math.max(0, lastEngagement.retweets + Math.floor(Math.random() * 21 - 10)),
        likes: Math.max(0, lastEngagement.likes + Math.floor(Math.random() * 31 - 15)),
        replies: Math.max(0, lastEngagement.replies + Math.floor(Math.random() * 11 - 5))
      }
    }
  ];

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
  };
  dashboardData.value.recentTweets = [newTweet, ...dashboardData.value.recentTweets.slice(0, -1)];

  // Update geographic data
  dashboardData.value.geoData = dashboardData.value.geoData.map(region => ({
    ...region,
    sentiment: Number((region.sentiment + (Math.random() * 0.2 - 0.1)).toFixed(2)),
    tweet_count: Math.max(50, region.tweet_count + Math.floor(Math.random() * 21 - 10))
  }));

  // Update topic clusters
  dashboardData.value.topicClusters = dashboardData.value.topicClusters.map(topic => ({
    ...topic,
    count: topic.count + Math.floor(Math.random() * 21 - 10),
    sentiment: Number((topic.sentiment + (Math.random() * 0.2 - 0.1)).toFixed(2))
  }));

  // Update hashtags
  const shouldAddNewHashtag = Math.random() > 0.7;
  if (shouldAddNewHashtag) {
    const newHashtags = [
      '#universitylife', '#campusevents', '#research', '#academics',
      '#studentlife', '#unilife', '#campuslife', '#studentsuccess',
      '#universityresearch', '#highered'
    ];
    const newHashtag = newHashtags[Math.floor(Math.random() * newHashtags.length)];

    if (!dashboardData.value.current.trending_hashtags.find(h => h.tag === newHashtag)) {
      dashboardData.value.current.trending_hashtags.pop(); // Remove last hashtag
      dashboardData.value.current.trending_hashtags.unshift({
        tag: newHashtag,
        count: Math.floor(Math.random() * 50) + 50
      });
    }
  }

  // Update hashtag counts and sort
  dashboardData.value.current.trending_hashtags = dashboardData.value.current.trending_hashtags
      .map(hashtag => ({
        ...hashtag,
        count: Math.max(50, hashtag.count + Math.floor(Math.random() * 21 - 10))
      }))
      .sort((a, b) => b.count - a.count);

  // Update current metrics
  dashboardData.value.current = {
    ...dashboardData.value.current,
    total_tweets: dashboardData.value.current.total_tweets + Math.floor(Math.random() * 50 + 10),
    average_sentiment: Number((
        dashboardData.value.current.average_sentiment + (Math.random() * 0.1 - 0.05)
    ).toFixed(2))
  };
};

let updateInterval: NodeJS.Timer | null = null

onMounted(() => {
  updateInterval = setInterval(() => {
    if (isAutoUpdateEnabled.value) {
      updateData()
    }
  }, 6000)
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

const getSentimentClass = (score: number): string => {
  if (score > 0.3) return 'text-green-600 font-medium'
  if (score < -0.3) return 'text-red-600 font-medium'
  return 'text-yellow-600 font-medium'
}

const getSentimentEmoji = (score: number): string => {
  if (score > 0.3) return '😊'
  if (score < -0.3) return '😞'
  return '😐'
}

const hasLeftColumn = computed(() =>
    activeSections.value.some(section => ['metrics', 'engagement'].includes(section))
)

const hasRightColumn = computed(() =>
    activeSections.value.some(section => ['geo', 'hashtags', 'tweets'].includes(section))
)

// Determine grid columns based on active sections
const gridColumns = computed(() => {
  const columns = []
  if (hasLeftColumn.value) columns.push('left')
  columns.push('middle')
  if (hasRightColumn.value) columns.push('right')

  switch (columns.length) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-2'
    case 3:
      return 'grid-cols-12'
    default:
      return 'grid-cols-12'
  }
})

// Determine middle section bottom grid columns
const middleBottomColumns = computed(() => {
  const hasEmotions = activeSections.value.includes('emotions')
  const hasTopics = activeSections.value.includes('topics')

  if (hasEmotions && hasTopics) {
    return 'grid-cols-2'
  }
  return 'grid-cols-1'
})

// Apply dynamic column spans
const columnSpan = computed(() => {
  if (!hasLeftColumn.value && !hasRightColumn.value) return 'col-span-12'
  if (!hasLeftColumn.value || !hasRightColumn.value) return 'col-span-8'
  return 'col-span-6'
})
</script>

<template>
  <div class="dashboard bg-gray-100 h-screen p-4">
    <!-- Top Controls remain the same -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex space-x-2">
        <button
            v-for="section in sections"
            :key="section.id"
            @click="toggleSection(section.id)"
            :class="[
            'px-3 py-1 rounded-lg text-md font-medium transition-colors',
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
    <div class="grid gap-4 h-[calc(100vh-6rem)]" :class="gridColumns">
      <!-- Left Column: Key Metrics + Engagement -->
      <div v-if="hasLeftColumn" class="space-y-4">
        <div v-if="activeSections.includes('metrics')"
             class="bg-white rounded-lg p-4 shadow-sm h-[40%]"
             style="display:flex;flex-direction:column;">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Summary Metrics</h2>
          <div class="flex-grow grid grid-rows-4 gap-4">
            <div v-for="metric in keyMetrics"
                 :key="metric.label"
                 class="flex items-center p-2 bg-gray-50 rounded-lg">
              <div class="text-4xl mr-3">{{ metric.icon }}</div>
              <div>
                <div class="text-xl font-semibold">{{ metric.value }}</div>
                <div class="text-lg text-gray-600">{{ metric.label }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeSections.includes('engagement')"
             class="bg-white rounded-lg p-4 shadow-sm h-[55%]">
          <EngagementChart :data="dashboardData.hourlyData"/>
        </div>
      </div>

      <!-- Middle Column: Main Charts -->
      <div class="space-y-4">
        <div v-if="activeSections.includes('sentiment')"
             class="bg-white rounded-lg p-4 shadow-sm h-1/2">
          <SentimentChart :data="timeframeData" @timeframe-changed="handleTimeframeChange"/>
        </div>
        <div class="grid gap-4 h-1/2" :class="middleBottomColumns">
          <div v-if="activeSections.includes('emotions')"
               class="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center"
               style="flex-direction:column;justify-content: space-around;">
            <h3 class="text-lg font-medium mb-2">Emotions Donut</h3>
            <EmotionChart :data="currentEmotions"/>
          </div>
          <div v-if="activeSections.includes('topics')"
               class="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center"
               style="flex-direction:column;justify-content: space-around;">
            <h3 class="text-lg font-medium mb-2">Trending Topics</h3>
            <TopicBubbleChart :data="dashboardData.topicClusters"/>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div v-if="hasRightColumn" class="space-y-4">
        <div v-if="activeSections.includes('geo')"
             class="bg-white rounded-lg p-4 shadow-sm h-[45%]">
          <GeoHeatmap :data="dashboardData.geoData"/>
        </div>
        <div v-if="activeSections.includes('hashtags')"
             class="bg-white rounded-lg p-4 shadow-sm h-[20%]">
          <HashtagCloud :hashtags="dashboardData.current.trending_hashtags"/>
        </div>
<!--        hey-->
        <div v-if="activeSections.includes('tweets')"
             class="bg-white rounded-lg p-4 shadow-sm h-[33%] overflow-auto">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Tweets</h2>
          <div class="space-y-3">
            <div v-for="tweet in recentTweetsLimited"
                 :key="tweet.id"
                 class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-1">
                <div class="font-medium text-blue-600">@{{ tweet.user.username }}</div>
                <div class="text-xs text-gray-500">
                  {{ new Date(tweet.created_at).toLocaleTimeString() }}
                </div>
              </div>
              <p class="text-lg mb-2">{{ tweet.text }}</p>
              <div class="flex items-center space-x-4 text-lg text-gray-600">
              <span class="flex items-center">
                <span class="mr-1">🔄</span>
                {{ tweet.public_metrics.retweet_count }}
              </span>
                <span class="flex items-center">
                <span class="mr-1">💬</span>
                {{ tweet.public_metrics.reply_count }}
              </span>
                <span class="flex items-center">
                <span class="mr-1">❤️</span>
                {{ tweet.public_metrics.like_count }}
              </span>
                <span :class="getSentimentClass(tweet.sentiment_score)">
                {{ getSentimentEmoji(tweet.sentiment_score) }}
                {{ tweet.sentiment_score }}
              </span>
              </div>
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

.grid.grid-cols-12 > *:nth-child(1) {
  grid-column: span 3;
}

.grid.grid-cols-12 > *:nth-child(2) {
  grid-column: span 6;
}

.grid.grid-cols-12 > *:nth-child(3) {
  grid-column: span 3;
}

.grid.grid-cols-2 > * {
  grid-column: span 1;
}

/* When only middle section is visible */
.grid.grid-cols-1 > * {
  grid-column: span 12;
}
</style>