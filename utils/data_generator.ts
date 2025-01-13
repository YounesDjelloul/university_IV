interface TweetMetrics {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
}

interface TweetUser {
    username: string;
    followers_count: number;
    verified: boolean;
}

interface Tweet {
    id: string;
    text: string;
    created_at: string;
    sentiment_score: number;
    subjectivity: number;
    emotion: EmotionType;
    keywords: string[];
    public_metrics: TweetMetrics;
    user: TweetUser;
    hashtags: string[];
    source: string;
}

interface SentimentDistribution {
    positive: number;
    neutral: number;
    negative: number;
}

interface EmotionDistribution {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    disgust: number;
}

type EmotionType = keyof EmotionDistribution;

interface GeoRegion {
    region: string;
    sentiment: number;
    tweet_count: number;
}

interface TopicCluster {
    topic: string;
    count: number;
    sentiment: number;
}

interface HashtagTrend {
    tag: string;
    count: number;
}

interface DashboardData {
    hourlyData: HourlyDataPoint[];
    recentTweets: Tweet[];
    geoData: GeoRegion[];
    topicClusters: TopicCluster[];
    current: {
        total_tweets: number;
        average_sentiment: number;
        trending_hashtags: HashtagTrend[];
    };
}

interface Engagement {
    retweets: number;
    likes: number;
    replies: number;
}

// Update HourlyDataPoint interface
interface HourlyDataPoint {
    timestamp: string;
    sentiment: SentimentDistribution;
    emotions: EmotionDistribution;
    engagement: Engagement;  // Add this line
}

export const generateMockData = (): DashboardData => {
    const emotions = ['joy', 'anger', 'fear', 'sadness', 'disgust'];
    const sources = ['Twitter Web App', 'Twitter for iPhone', 'Twitter for Android'];
    const hashtags = [
        '#innovation',
        '#techresearch',
        '#futurescience',
        '#sustainability',
        '#globalcampus',
        '#diversityinedu',
        '#scholarships',
        '#mentorship',
        '#entrepreneurship',
        '#artsandculture'
    ];

    const keywords = [
        'innovation',
        'sustainability',
        'diversity',
        'entrepreneurship',
        'technology',
        'partnerships',
        'mentorship',
        'leadership',
        'collaboration',
        'culture'
    ];

    const generateInitialEngagement = () => ({
        retweets: Math.floor(Math.random() * 50 + 30),
        likes: Math.floor(Math.random() * 100 + 50),
        replies: Math.floor(Math.random() * 30 + 10)
    });

    const hourlyData = Array.from({length: 24}, (_, i) => {
        const date = new Date();
        date.setHours(date.getHours() - i);

        return {
            timestamp: date.toISOString(),
            sentiment: {
                positive: Math.floor(Math.random() * 50) + 30,
                neutral: Math.floor(Math.random() * 30) + 20,
                negative: Math.floor(Math.random() * 20) + 10,
            },
            emotions: emotions.reduce((acc, emotion) => {
                acc[emotion] = Math.floor(Math.random() * 100);
                return acc;
            }, {}),
            engagement: generateInitialEngagement() // Add engagement data
        };
    }).reverse();

    const recentTweets: Tweet[] = Array.from({length: 50}, (_, i) => ({
        id: `tweet_${i}`,
        text: `Sample tweet ${i} about university life and campus activities #university`,
        created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        sentiment_score: Number((Math.random() * 2 - 1).toFixed(2)),
        subjectivity: Number(Math.random().toFixed(2)),
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        keywords: Array.from(
            {length: Math.floor(Math.random() * 3) + 1},
            () => keywords[Math.floor(Math.random() * keywords.length)]
        ),
        public_metrics: {
            retweet_count: Math.floor(Math.random() * 100),
            reply_count: Math.floor(Math.random() * 50),
            like_count: Math.floor(Math.random() * 200),
            quote_count: Math.floor(Math.random() * 20),
        },
        user: {
            username: `user_${Math.floor(Math.random() * 1000)}`,
            followers_count: Math.floor(Math.random() * 10000),
            verified: Math.random() > 0.9,
        },
        hashtags: Array.from(
            {length: Math.floor(Math.random() * 2) + 1},
            () => hashtags[Math.floor(Math.random() * hashtags.length)]
        ),
        source: sources[Math.floor(Math.random() * sources.length)],
    }));

    const geoData: GeoRegion[] = [
        {region: 'North Campus', sentiment: 0.8, tweet_count: 150},
        {region: 'South Campus', sentiment: 0.6, tweet_count: 120},
        {region: 'Downtown', sentiment: 0.4, tweet_count: 200},
        {region: 'Research Park', sentiment: 0.7, tweet_count: 80},
        {region: 'Student Housing', sentiment: 0.5, tweet_count: 180},
    ];

    const topicClusters: TopicCluster[] = [
        {topic: 'Innovation Hub', count: 278, sentiment: 0.75},
        {topic: 'Global Impact', count: 234, sentiment: 0.82},
        {topic: 'Sustainability', count: 198, sentiment: 0.5},
        {topic: 'Arts & Culture', count: 167, sentiment: 0.31},
        {topic: 'Alumni', count: 145, sentiment: 0.79},
        {topic: 'Career Success', count: 132, sentiment: 0.85},
        {topic: 'Community Service', count: 112, sentiment: 0.93}
    ];

    return {
        hourlyData,
        recentTweets,
        geoData,
        topicClusters,
        current: {
            total_tweets: 1234,
            average_sentiment: 0.65,
            trending_hashtags: hashtags.map(tag => ({
                tag,
                count: Math.floor(Math.random() * 100) + 50
            })),
        }
    };
};

export type {
    Tweet,
    TweetMetrics,
    TweetUser,
    SentimentDistribution,
    EmotionDistribution,
    EmotionType,
    GeoRegion,
    TopicCluster,
    HashtagTrend,
    HourlyDataPoint,
    DashboardData
};