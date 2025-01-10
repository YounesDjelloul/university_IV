export const generateTimeframeMockData = (timeframe: 'day' | 'week' | 'month' | 'year') => {
    const getDataPoints = () => {
        switch (timeframe) {
            case 'day':
                return 24;  // 24 hours
            case 'week':
                return 7 * 24;  // 7 days * 24 hours
            case 'month':
                return 30 * 24;  // 30 days * 24 hours
            case 'year':
                return 365;  // 365 days (daily data points)
            default:
                return 24;
        }
    };

    const getTimeIncrement = () => {
        switch (timeframe) {
            case 'day':
                return 60 * 60 * 1000;  // 1 hour in milliseconds
            case 'week':
                return 60 * 60 * 1000;  // 1 hour in milliseconds
            case 'month':
                return 60 * 60 * 1000;  // 1 hour in milliseconds
            case 'year':
                return 24 * 60 * 60 * 1000;  // 1 day in milliseconds
            default:
                return 60 * 60 * 1000;
        }
    };

    const dataPoints = getDataPoints();
    const timeIncrement = getTimeIncrement();

    // Generate data points
    return Array.from({length: dataPoints}, (_, i) => {
        const date = new Date();
        date.setTime(date.getTime() - (i * timeIncrement));

        return {
            timestamp: date.toISOString(),
            sentiment: {
                positive: Math.floor(Math.random() * 50) + 30,
                neutral: Math.floor(Math.random() * 30) + 20,
                negative: Math.floor(Math.random() * 20) + 10,
            },
            emotions: {
                joy: Math.floor(Math.random() * 100),
                anger: Math.floor(Math.random() * 100),
                fear: Math.floor(Math.random() * 100),
                sadness: Math.floor(Math.random() * 100),
                disgust: Math.floor(Math.random() * 100)
            },
            engagement: {
                retweets: Math.floor(Math.random() * 50) + 30,
                likes: Math.floor(Math.random() * 100) + 50,
                replies: Math.floor(Math.random() * 30) + 10
            }
        };
    }).reverse();
};