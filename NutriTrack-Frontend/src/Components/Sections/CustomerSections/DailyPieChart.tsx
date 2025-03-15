import { XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import React from 'react';

export interface DailyPieChartProps {
  dailyData: {
    calorieData?: { name?: string; totalCalories?: number }[];
    nutrientData?: { name?: string; value?: number }[];
  };
}

const DailyPieChart: React.FC<DailyPieChartProps> = ({ dailyData }) => {

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; index: number }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (

    <div className="flex justify-center items-center w-full h-full">
      <BarChart width={100} height={300} data={dailyData.calorieData} >
        <XAxis type="category" dataKey="name" />
        <YAxis type="number" domain={[0,3000]}/>
        <Tooltip />
        <Bar dataKey="totalCalories" fill="#4CAF50" background={{ fill: '#ddd' }}/>
      </BarChart>

      <PieChart width={500} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={dailyData.nutrientData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={renderCustomizedLabel}
          labelLine={false}>

          {dailyData.nutrientData?.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Legend />

        <Tooltip />
      </PieChart>
      

    </div>
  );
};

export default DailyPieChart;