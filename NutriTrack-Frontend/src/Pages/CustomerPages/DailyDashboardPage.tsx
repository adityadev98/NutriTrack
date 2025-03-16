import React, { useEffect, useState } from 'react';
import {Sidenav} from "../../Components/Sections";
import { getDailyData }  from '../../Services/dailyDashboardServices';
import DailyPieChart from '@/Components/Sections/CustomerSections/DailyPieChart';
import { DailyPieChartProps } from '@/Components/Sections/CustomerSections/DailyPieChart';

const DailyDashboardPage: React.FC = () => {
    const [dailyData, setDailyData] = useState<DailyPieChartProps['dailyData']|undefined>(undefined);

    useEffect(() => {
        getDailyData()
          .then(setDailyData);
      }, []);

    return (
        <Sidenav>
        <div className="main-heading">
            <h1>Today's Nutrient Intake</h1>
        </div>
        {dailyData ? (
                <DailyPieChart dailyData={dailyData} />
            ) : (
                <p>No meals today</p>
        )}
        </Sidenav>
    );
};

export default DailyDashboardPage;