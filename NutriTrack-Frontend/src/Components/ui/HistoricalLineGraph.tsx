import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import React from 'react';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
    ];


const HistoricalLineGraph: React.FC = ({ historicalData }) => {
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
          <XAxis dataKey="eatenDate" />
          <YAxis yAxisId="left" label={{ value: "Calories (kCal)", angle: -90, position: 'left' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: "Nutrients (g)", angle: -90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="linear" dataKey="totalCalories" stroke="#4E79A7" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="linear" dataKey="totalProtein" stroke="#F28E2B" />
          <Line yAxisId="right" type="linear" dataKey="totalFat" stroke="#E15759" />
          <Line yAxisId="right" type="linear" dataKey="totalCarbohydrate" stroke="#76B7B2" />
          <Line yAxisId="right" type="linear" dataKey="totalFiber" stroke="#B07AA1" />
        </LineChart>
      </div>
    );
};

export default HistoricalLineGraph;