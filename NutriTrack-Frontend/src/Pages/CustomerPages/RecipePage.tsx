import React, { useState, useEffect } from 'react';
import {
    Input, Select, Button, Box, Image, Text, SimpleGrid,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalCloseButton, useDisclosure, List, ListItem, ListIcon
} from '@chakra-ui/react';
import { fetchMealsByName, fetchMealsByFilter, fetchRecipeDetails, fetchCategoriesByName,fetchArea } from '@/Services/recipeAPI';
import { Sidenav } from '@/Components/Sections';
import { debounce } from 'lodash'; 

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strInstructions?: string;
    strCategory?: string;
    strArea?: string;
    ingredients?: string[];

}

const RecipePage: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [filterType, setFilterType] = useState<'category' | 'area'>('category');
    const [filterValue, setFilterValue] = useState<string>('');
    const [meals, setMeals] = useState<Meal[]>([]);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [areas, setAreas] = useState<string[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchResults, setSearchResults] = useState<Meal[]>([]);

    useEffect(() => {
        getCategories(); 
        getArea();
    }, []);

    const searchMeals = async () => {
        const meals = await fetchMealsByName(query);
        setMeals(meals);
    };

    const debouncedSearch = debounce((value: string) => searchMeals(value), 500); // Debounced search function

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value) {
            debouncedSearch(value); // Trigger search on input change
        } else {
            setSearchResults([]); // Clear results when query is empty
        }
    };

    const filterMeals = async () => {
        const meals = await fetchMealsByFilter(filterType, filterValue);
        setMeals(meals);
    };

    const getMealDetails = async (id: string) => {
        const meal = await fetchRecipeDetails(id);
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
       
        setSelectedMeal({ ...meal, ingredients });
        onOpen(); 
    };

    const getCategories = async () => {
        const categories = await fetchCategoriesByName();
        setCategories(categories);
        console.log(categories);
    };

    const getArea = async() => {
        const areas = await fetchArea();
        setAreas(areas);
        console.log(areas); 
    }

    return (
        <Sidenav>
        <Box p={5}>
            <Box display="flex" gap={3} mb={5}>
            <Input
                        placeholder="Search meal by name"
                        value={query}
                        onChange={handleSearchChange}
                    />                <Button onClick={searchMeals} colorScheme="green">Search</Button>
            </Box>
            {searchResults.length > 0 && (
                    <List spacing={1} bg="white" boxShadow="md" borderRadius="md" maxHeight="300px" overflowY="auto">
                        {searchResults.map((meal) => (
                            <ListItem
                                key={meal.idMeal}
                                display="flex"
                                alignItems="center"
                                padding={2}
                                cursor="pointer"
                                onClick={() => getMealDetails(meal.idMeal)}
                            >
                                <ListIcon as={Image} src={meal.strMealThumb} boxSize="40px" mr={2} />
                                <Text>{meal.strMeal}</Text>
                            </ListItem>
                        ))}
                    </List>
                )}
            <Box display="flex" gap={3} mb={5}>
                <Select onChange={(e) => setFilterType(e.target.value as 'category' | 'area')}>
                    <option value="category">Category</option>
                    <option value="area">Cuisine</option>
                </Select>
                {filterType === 'category' && (
                    <Select onChange={(e) => setFilterValue(e.target.value)} placeholder="Select Category">
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </Select>
                )}
                  {filterType === 'area' && (
                    <Select onChange={(e) => setFilterValue(e.target.value)} placeholder="Select Category">
                        {areas.map((area, index) => (
                            <option key={index} value={area}>{area}</option>
                        ))}
                    </Select>
                )}
                <Button onClick={filterMeals} colorScheme="green">Filter</Button>
            </Box>
            <SimpleGrid columns={3} spacing={5}>
                {meals.map(meal => (
                    <Box key={meal.idMeal} onClick={() => getMealDetails(meal.idMeal)} cursor="pointer" p={3} borderWidth={1} borderRadius="lg">
                        <Image src={meal.strMealThumb} alt={meal.strMeal} />
                        <Text mt={2} fontWeight="bold">{meal.strMeal}</Text>
                    </Box>
                ))}
            </SimpleGrid>
            {/* {selectedMeal && (
                <Box mt={5} p={5} borderWidth={1} borderRadius="lg">
                    <Text fontSize="2xl" fontWeight="bold">{selectedMeal.strMeal}</Text>
                    <Image src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
                    <Text mt={3}>{selectedMeal.strInstructions}</Text>
                </Box>
            )} */}
        </Box>
        {/* Modal for Meal Details */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedMeal?.strMeal}</ModalHeader>
                            <ModalCloseButton />
                                <ModalBody>
                                    {selectedMeal && (
                                        <Box>
                                            <Image src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} borderRadius="md" mb={4} />
                                            <Text><strong>Category:</strong> {selectedMeal.strCategory}</Text>
                                            <Text><strong>Cuisine:</strong> {selectedMeal.strArea}</Text>

                                            {/* Ingredients List */}
                                            <Text mt={3} fontWeight="bold">Ingredients:</Text>
                                                <ol style={{ paddingLeft: "20px" }}>
                                                    {selectedMeal.ingredients?.map((item, index) => (
                                                        <li key={index} style={{ marginBottom: "5px" }}>
                                                            {`${index + 1}. ${item}`}
                                                        </li>
                                                    ))}
                                                </ol>


                                            <Text mt={3} fontWeight="bold">Instructions:</Text>
                                            <ol style={{ paddingLeft: "20px" }}>
                                                {selectedMeal.strInstructions
                                                    ?.split(/\. (?=[A-Z])/g) // ✅ Splits at periods followed by an uppercase letter
                                                    .map((step, index) => step.trim() && (
                                                        <li key={index} style={{ marginBottom: "8px" }}>
                                                            {`${index + 1}. ${step}.`}
                                                        </li>
                                                    ))
                                                }
                                            </ol>
                                        </Box>
                                    )}
                                </ModalBody>
                        </ModalContent>
                </Modal>
        </Sidenav>
    );
};

export default RecipePage;
