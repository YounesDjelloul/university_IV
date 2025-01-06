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

interface HourlyDataPoint {
    timestamp: string;
    sentiment: SentimentDistribution;
    emotions: EmotionDistribution;
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

export const generateMockData = (): DashboardData => {
    const emotions: EmotionType[] = ['joy', 'anger', 'fear', 'sadness', 'disgust'];
    const sources: string[] = ['Twitter Web App', 'Twitter for iPhone', 'Twitter for Android'];
    const hashtags: string[] = ['#universitylife', '#campusevents', '#research', '#academics', '#studentlife'];
    const keywords: string[] = ['research', 'campus', 'professors', 'students', 'classes', 'events', 'facilities'];

    const hourlyData: HourlyDataPoint[] = Array.from({ length: 24 }, (_, i) => {
        const date = new Date();
        date.setHours(date.getHours() - i);

        const emotionDistribution: EmotionDistribution = emotions.reduce((acc, emotion) => ({
            ...acc,
            [emotion]: Math.floor(Math.random() * 100)
        }), {} as EmotionDistribution);

        return {
            timestamp: date.toISOString(),
            sentiment: {
                positive: Math.floor(Math.random() * 50) + 30,
                neutral: Math.floor(Math.random() * 30) + 20,
                negative: Math.floor(Math.random() * 20) + 10,
            },
            emotions: emotionDistribution
        };
    }).reverse();

    const recentTweets: Tweet[] = Array.from({ length: 50 }, (_, i) => ({
        id: `tweet_${i}`,
        text: `Sample tweet ${i} about university life and campus activities #university`,
        created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        sentiment_score: Number((Math.random() * 2 - 1).toFixed(2)),
        subjectivity: Number(Math.random().toFixed(2)),
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        keywords: Array.from(
            { length: Math.floor(Math.random() * 3) + 1 },
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
            { length: Math.floor(Math.random() * 2) + 1 },
            () => hashtags[Math.floor(Math.random() * hashtags.length)]
        ),
        source: sources[Math.floor(Math.random() * sources.length)],
    }));

    const geoData: GeoRegion[] = [
        { region: 'North Campus', sentiment: 0.8, tweet_count: 150 },
        { region: 'South Campus', sentiment: 0.6, tweet_count: 120 },
        { region: 'Downtown', sentiment: 0.4, tweet_count: 200 },
        { region: 'Research Park', sentiment: 0.7, tweet_count: 80 },
        { region: 'Student Housing', sentiment: 0.5, tweet_count: 180 },
    ];

    const topicClusters: TopicCluster[] = [
        { topic: 'Academic Programs', count: 245, sentiment: 0.6 },
        { topic: 'Campus Life', count: 189, sentiment: 0.8 },
        { topic: 'Research', count: 156, sentiment: 0.7 },
        { topic: 'Sports', count: 134, sentiment: 0.9 },
        { topic: 'Facilities', count: 98, sentiment: 0.4 },
    ];

    const trending_hashtags: HashtagTrend[] = hashtags.map(tag => ({
        tag,
        count: Math.floor(Math.random() * 100) + 50
    }));

    return {
        hourlyData,
        recentTweets,
        geoData,
        topicClusters,
        current: {
            total_tweets: 1234,
            average_sentiment: 0.65,
            trending_hashtags,
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