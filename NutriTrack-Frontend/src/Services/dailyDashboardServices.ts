import axios from 'axios';

export const getDailyData = async () => {
    try {
        const response = await axios.get(`/api/history`, {
            // TO DO: change to current date
            params: {
                timeAgg: 'day',
                startDate: '2025-01-18',
                endDate: '2025-01-18'
            }
        });
        let result = {};
        if (response.data.data.trackings.length > 0) {
            const tracking = response.data.data.trackings[0];
            const nutrientData = [
                { name: 'totalCarbohydrate', value: tracking.totalCarbohydrate },
                { name: 'totalFat', value: tracking.totalFat },
                { name: 'totalFiber', value: tracking.totalFiber },
                { name: 'totalProtein', value: tracking.totalProtein }
            ];
            const calorieData = [
                { name: 'Calories', totalCalories: tracking.totalCalories }
            ]
            result = { nutrientData, calorieData };
        }
        console.log('Historical data:', result);
        return result;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
};
