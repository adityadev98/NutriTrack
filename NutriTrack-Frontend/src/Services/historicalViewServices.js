import axios from 'axios';

const BASE_URL = 'http://localhost:7000';

export const getHistoricalData = async (timeAggParam = 'month', startDate = null, endDate = null) => {
    try {
        const response = await axios.get(`${BASE_URL}/history`, {
            params: {
                timeAgg: timeAggParam,
                startDate: startDate,
                endDate: endDate
            }
        });
        let filledTrackings = fillMissingDates(response.data.data.trackings);
        let dateFixedTrackings = convertTrackingDatesToEpoch(filledTrackings);
        console.log('Historical data:', dateFixedTrackings);
        return dateFixedTrackings;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
};

export const fillMissingDates = (trackings) => {
    if (trackings.length === 0) return trackings;

    const filledTrackings = [];
    const startDate = new Date(trackings[0].aggTime);
    const endDate = new Date(trackings[trackings.length - 1].aggTime);
    let currentDate = new Date(startDate);

    const trackingMap = new Map(trackings.map(tracking => [new Date(tracking.aggTime).toDateString(), tracking]));

    while (currentDate < endDate) {
        const dateString = currentDate.toDateString();
        if (trackingMap.has(dateString)) {
            filledTrackings.push(trackingMap.get(dateString));
        } else {
            filledTrackings.push({ aggTime: currentDate.getTime() });
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    filledTrackings.push(trackingMap.get(endDate.toDateString()));
    return filledTrackings;
};

export const convertTrackingDatesToEpoch = (trackings) => {
    return trackings.map(tracking => {
        const date = new Date(tracking.aggTime);
        const epochTime = date.getTime();
        return {
            ...tracking,
            aggTime: epochTime
        };
    });
};


export const convertEpochToFormattedDate = (epochTime) => {
    const date = new Date(epochTime);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        timeZone: "UTC"
    });
};


export const formatTrackingDates = (trackings) => {
    return trackings.map(tracking => {
        const date = new Date(tracking.aggTime);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            timeZone: "UTC"
          });
        return {
            ...tracking,
            aggTime: formattedDate
        };
    });
};
