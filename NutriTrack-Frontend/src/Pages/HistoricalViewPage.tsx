import HistoricalLineGraph from '@/Components/ui/HistoricalLineGraph';
import React, { useEffect, useState } from 'react';

import { getHistoricalData }  from '../Services/historicalViewServices.js';
import HistoricalFilterForm from '@/Components/ui/HistoricalFilterForm.js';

const HistoricalViewPage: React.FC = () => {
    const [historicalData, setHistoricalData] = useState([]);

    useEffect(() => {
        getHistoricalData('month')
          .then(setHistoricalData);
      }, []);

    const handleFormSubmit = (selectedValue = 'month') => {
        getHistoricalData(selectedValue)
          .then(setHistoricalData);
    };

    return (
        <div>
        <div className="main-heading">
            <h1>Historical Nutrient Intake</h1>
        </div>
        <HistoricalFilterForm onSubmit={handleFormSubmit}/>
        <HistoricalLineGraph historicalData={historicalData}/>
        </div>
    );
};

export default HistoricalViewPage;