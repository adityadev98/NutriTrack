import axios from 'axios';

const BASE_URL = 'http://localhost:7000';

export const getHistoricalData = async (timeAggParam = 'month') => {
    try {
        const response = await axios.get(`${BASE_URL}/history`, {
            params: {
                timeAgg: timeAggParam
            }
        });
        console.log('Historical data:', response.data.data.trackings);
        return response.data.data.trackings;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
};

