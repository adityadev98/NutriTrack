import HistoricalLineGraph from '@/Components/Sections/CustomerSections/HistoricalLineGraph.js';
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { Sidenav } from "../../Components/Sections/index.js";
import { getHistoricalData } from '../../Services/historicalViewServices.js';
import HistoricalFilterForm from '@/Components/Sections/CustomerSections/HistoricalFilterForm.js';
import { HistoricalLineGraphProps } from '@/Components/Sections/CustomerSections/HistoricalLineGraph.js';

const HistoricalViewPage: React.FC = () => {
    const [historicalData, setHistoricalData] = useState<HistoricalLineGraphProps['historicalData']>([]);

    useEffect(() => {
        getHistoricalData('month').then(setHistoricalData);
    }, []);

    const handleFormSubmit = (selectedValue: string = 'month', startDate?: string | null, endDate?: string | null) => {
        getHistoricalData(selectedValue, startDate, endDate).then(setHistoricalData);
    };

    return (
        <Sidenav>
            <Box p={8}>
                <Box bg="white" boxShadow="md" borderRadius="lg" p={0} mb={10}>
                    <Box bg="var(--dark-green)" borderTopRadius="lg" px={6} py={4}>
                        <Heading size="lg" color="white">Historical Nutrient Insights</Heading>
                    </Box>
                    <Box p={6} color="var(--dark-green)">
                        <Text fontSize="md" fontWeight="medium">
                            Track your nutrition journey over time. Use this dashboard to view your weekly or monthly intake patterns and adjust your habits accordingly.
                        </Text>
                    </Box>
                </Box>

                <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
                    <HistoricalFilterForm onSubmit={handleFormSubmit} />
                    <HistoricalLineGraph historicalData={historicalData} />
                </Box>
            </Box>
        </Sidenav>
    );
};

export default HistoricalViewPage;
