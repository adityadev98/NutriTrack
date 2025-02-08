import axios from 'axios';

const BASE_URL = 'http://localhost:7000';

export const getHistoricalData = async (timeAgg = 'month') => {
    try {
        const response = await axios.get(`${BASE_URL}/history`, {
            params: {
                timeAgg: timeAgg
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
};