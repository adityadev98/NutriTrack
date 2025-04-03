import React, { useEffect, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { Sidenav } from "../../Components/Sections";
import { getDailyData } from '../../Services/dailyDashboardServices';
import DailyPieChart from '@/Components/Sections/CustomerSections/DailyPieChart';
import { DailyPieChartProps } from '@/Components/Sections/CustomerSections/DailyPieChart';

const DailyDashboardPage: React.FC = () => {
    const [dailyData, setDailyData] = useState<DailyPieChartProps['dailyData'] | undefined>(undefined);

    useEffect(() => {
        getDailyData().then(setDailyData);
    }, []);

    return (
        <Sidenav>
            <Box p={8}>
                <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
                    <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
                        <Heading size="lg" color="white">Today's Nutrition Breakdown</Heading>
                    </Box>
                    <Box p={6} color="var(--dark-green)">
                        <Text fontSize="md" fontWeight="medium">
                            Visualize how your macronutrients add up today. Keep track of carbs, proteins, and fats to stay on top of your dietary goals.
                        </Text>
                    </Box>
                </Box>

                <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
                    {dailyData ? (
                        <DailyPieChart dailyData={dailyData} />
                    ) : (
                        <Text>No meals today</Text>
                    )}
                </Box>
            </Box>
        </Sidenav>
    );
};

export default DailyDashboardPage;
