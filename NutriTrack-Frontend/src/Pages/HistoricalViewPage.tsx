import HistoricalLineGraph from '@/Components/ui/HistoricalLineGraph';
import React from 'react';

const HistoricalViewPage: React.FC = () => {
    return (
        <div>
        <div className="main-heading">
            <h1>Historical Nutrient Intake</h1>
        </div>
        <HistoricalLineGraph />
        </div>
    );
};

export default HistoricalViewPage;