import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {Sidenav} from "../../Components/Sections";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  VStack,
  List,
  ListItem,
  Heading,
} from "@chakra-ui/react";

const CreateCustomFoodPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [storedFoodItems, setStoredFoodItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    foodName: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    fiber: "",
    serving_unit:"",
    serving_weight_grams:""
  });

  useEffect(() => {
   
    // Fetch custom food items if token is valid
    fetch("api/getCustomFood", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`, 
      },
    })
      .then((response) => {
        if (response.status === 500) {
          throw new Error("Error in retrieving data"); // Only alert for 500 error
        }
        if (response.status === 404) {
          return Promise.resolve(JSON.stringify({ data: [] })); // If 404, handle gracefully and return empty data
        }
        return response.text();
      })
      .then((text) => {
        if (text) {
          return JSON.parse(text); // Parse text to JSON if not empty
        }
        return { data: [] }; // Return empty data if response is empty
      })
      .then((data) => setStoredFoodItems(Array.isArray(data.data) ? data.data : [])) // Ensure it's always an array
      .catch((error) => {
        alert("Error fetching custom foods."+ error);
      });
      }, []);

  const allFoodItems = [...(storedFoodItems || []), ...foodItems];

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as keyof typeof formData]: value, // Type assertion for key
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.foodName || !formData.serving_unit || !formData.calories) {
      alert("Food name, serving unit, and calories are required!");
      return;
    }

    const requestBody = {
      userId: localStorage.user,
      foodName: formData.foodName,
      details: {
        calories: Number(formData.calories),
        protein: Number(formData.protein) || 0,
        carbohydrates: Number(formData.carbohydrates) || 0,
        fat: Number(formData.fat) || 0,
        fiber: Number(formData.fiber) || 0,
      },
      serving_unit: formData.serving_unit,
      serving_weight_grams: formData.serving_weight_grams

    };

    console.log("allFoodItems", allFoodItems);
    try {
      const response = await fetch("api/customFood", {
        method: "POST",
        headers: {  "Authorization": `Bearer ${localStorage.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) throw new Error("Failed to add food item");

      const responseData = await response.text();
      console.log("responseData", responseData);
      if (responseData) {
        const data = JSON.parse(responseData);
        if (data.success && data.data) {
          setFoodItems((prevFoodItems) => [...prevFoodItems, data.data]);
        }
      }
      onClose();
      setFormData({ foodName: "", calories: "", protein: "", carbohydrates: "", fat: "", fiber: "" , serving_unit:"",serving_weight_grams:""});
    } catch (error) {
      alert("Error adding food item."+error);
    }
  };

  return (
    <Sidenav>
    <Box textAlign="center" p={6}>
      <Heading color="var(--dark-green)">Create Your Own Meal</Heading>
      {/* <Text fontSize="2xl" fontWeight="bold">Create Your Own Meal</Text> */}
      <Button mt={4} colorScheme="green" onClick={onOpen}>
        Create a Meal
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>
          <Heading as="h2" size="md">Add Food Item</Heading>
        </ModalHeader>
        <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {Object.keys(formData).map((key) => (
                  <FormControl key={key} isRequired={["foodName", "serving_unit", "calories", "serving_weight_grams"].includes(key)}>
                    <FormLabel  htmlFor={key} textTransform="capitalize">
                      {key === "foodName"
                        ? "Food name" // Ensure exact match
                        : key === "serving_unit"
                        ? "Serving unit"
                        : key === "serving_weight_grams"
                        ? "Serving Weight Grams"
                        : key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    </FormLabel>
                    <Input
                      id={key}
                      type={["calories", "protein", "carbohydrates", "fat", "fiber", "serving_weight_grams"].includes(key) ? "number" : "text"}
                      name={key}
                      value={formData[key as keyof typeof formData]}
                     onChange={handleChange}
                    />
                  </FormControl>
                ))}
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
              Add Food Item
            </Button>
            <Button onClick={onClose} ml={3} colorScheme="red">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      
      {/* Display Added Food Items */}
      <Heading size="md" mt={5}>Added Food Items</Heading>
      <List spacing={3} mt={3}>
        {allFoodItems.length === 0 ? (
          <Box>No food items added yet.</Box>
        ) : (
          allFoodItems.map((food, index) => (
            <ListItem
              key={index}
              p={3}
              borderWidth={1}
              borderRadius="md"
              cursor="pointer"
              onClick={() => navigate(`/trackCustomFood`, { state: { food: food } })}
              _hover={{ bg: "gray.100" }}
              data-testid={`food-item-${food.foodName}`}
            >
              <strong>{food.foodName}</strong> - {food.details.calories} cal per {food.serving_unit}
            </ListItem>
          ))
        )}
      </List>
    </Box>
    </Sidenav>
  );
};

export default CreateCustomFoodPage;