import HistoricalLineGraph from '@/Components/ui/HistoricalLineGraph';
import React, { useEffect, useState } from 'react';
import {Sidenav} from "../Components/Sections";
import { getDailyData }  from '../Services/dailyDashboardServices';
import DailyPieChart from '@/Components/ui/DailyPieChart';

const DailyDashboardPage: React.FC = () => {
    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        getDailyData()
          .then(setDailyData);
      }, []);

    return (
        <Sidenav>
        <div className="main-heading">
            <h1>Today's Nutrient Intake</h1>
        </div>
        <DailyPieChart dailyData={dailyData}/>
        </Sidenav>
    );
};

export default DailyDashboardPage;