import HistoricalLineGraph from '@/Components/ui/HistoricalLineGraph';
import React, { useEffect, useState } from 'react';
import {Sidenav} from "../../Components/Sections/index.js";

import { getHistoricalData }  from '../../Services/historicalViewServices.js';
import HistoricalFilterForm from '@/Components/ui/HistoricalFilterForm.js';

const HistoricalViewPage: React.FC = () => {
    const [historicalData, setHistoricalData] = useState([]);

    useEffect(() => {
        getHistoricalData('month')
          .then(setHistoricalData);
      }, []);

    const handleFormSubmit = (selectedValue = 'month', startDate = null, endDate = null) => {
        getHistoricalData(selectedValue, startDate, endDate)
          .then(setHistoricalData);
    };

    return (
        <Sidenav>
        <div className="main-heading">
            <h1>Historical Nutrient Intake</h1>
        </div>
        <HistoricalFilterForm onSubmit={handleFormSubmit}/>
        <HistoricalLineGraph historicalData={historicalData}/>
        </Sidenav>
    );
};

export default HistoricalViewPage;