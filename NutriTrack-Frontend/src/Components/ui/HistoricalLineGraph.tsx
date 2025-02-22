import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import React, { useState } from 'react';
import { convertEpochToFormattedDate }  from '../../Services/historicalViewServices';


const HistoricalLineGraph: React.FC = ({ historicalData }) => {

    const [visibleLines, setVisibleLines] = useState({
      totalCalories: true,
      totalProtein: true,
      totalFat: true,
      totalFiber: true,
      totalCarbohydrate: true,
    });

    const handleLegendClick = (e: any) => {
      const { dataKey } = e;
      setVisibleLines((prev) => ({
        ...prev,
        [dataKey]: !prev[dataKey], // Toggle visibility
      }));   
    };

    return (
        <div className="flex justify-center items-center w-full h-full">
        <LineChart
          width={700}
          height={400}
          data={historicalData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis includeHidden dataKey="aggTime" angle="-45" tickMargin="20" tickFormatter={convertEpochToFormattedDate}
          scale="time" type="number" domain={['dataMin','dataMax + 1000']} />
          <YAxis includeHidden yAxisId="left" label={{ value: "Calories (kCal)", angle: -90, position: 'left' }} />
          <YAxis includeHidden yAxisId="right" orientation="right" label={{ value: "Nutrients (g)", angle: -90, position: 'insideRight' }} />
          <Tooltip labelFormatter={convertEpochToFormattedDate} />
          <Legend wrapperStyle={{ position: 'relative' }} onClick={handleLegendClick} />

          <Line connectNulls yAxisId="left" type="linear" dataKey="totalCalories" stroke="#4E79A7" activeDot={{ r: 8 }} hide={!visibleLines.totalCalories} />
          <Line connectNulls yAxisId="right" type="linear" dataKey="totalProtein" stroke="#F28E2B" hide={!visibleLines.totalProtein} />
          <Line connectNulls yAxisId="right" type="linear" dataKey="totalFat" stroke="#E15759" hide={!visibleLines.totalFat} />
          <Line connectNulls yAxisId="right" type="linear" dataKey="totalCarbohydrate" stroke="#76B7B2" hide={!visibleLines.totalCarbohydrate} />
          <Line connectNulls yAxisId="right" type="linear" dataKey="totalFiber" stroke="#B07AA1" hide={!visibleLines.totalFiber} />
          
        </LineChart>
      </div>
    );
};

export default HistoricalLineGraph;