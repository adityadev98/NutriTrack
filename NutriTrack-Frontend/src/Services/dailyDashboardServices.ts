import axios from 'axios';

export const getDailyData = async () => {
    try {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token); // Debug log
        const response = await axios.get(`/api/history`, {
            // TO DO: change to current date
            params: {
                timeAgg: 'day',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
            }
            ,headers: {
                Authorization: `Bearer ${token}`,
            },
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
