import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Sidenav } from "../../Components/Sections";
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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  HStack
} from "@chakra-ui/react";
import { ChevronDownIcon, AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons"; // Improved icons

const CreateCustomFoodPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [storedFoodItems, setStoredFoodItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    foodName: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    fiber: "",
    serving_unit: "",
    serving_weight_grams: ""
  });
  const [editFoodItem, setEditFoodItem] = useState<any | null>(null);
 
  useEffect(() => {
    fetch("api/getCustomFood", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((response) => {
        if (response.status === 500) {
          throw new Error("Error in retrieving data");
        }
        if (response.status === 404) {
          return Promise.resolve(JSON.stringify({ data: [] }));
        }
        return response.text();
      })
      .then((text) => {
        if (text) {
          return JSON.parse(text);
        }
        return { data: [] };
      })
      .then((data) => setStoredFoodItems(Array.isArray(data.data) ? data.data : []))
      .catch((error) => {
        alert("Error fetching custom foods: " + error);
      });
  }, []);

  const allFoodItems = [...(storedFoodItems || []), ...foodItems];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as keyof typeof formData]: value,
    });
  };
  // Reset formData when opening the Create modal
  const handleCreateOpen = () => {
    setFormData({
      foodName: "",
      calories: "",
      protein: "",
      carbohydrates: "",
      fat: "",
      fiber: "",
      serving_unit: "",
      serving_weight_grams: ""
    });
    onCreateOpen();
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

    try {
      const response = await fetch("api/customFood", {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to add food item");

      const responseData = await response.text();
      if (responseData) {
        const data = JSON.parse(responseData);
        if (data.success && data.data) {
          setFoodItems((prevFoodItems) => [...prevFoodItems, data.data]);
        }
      }
      onCreateClose();
      setFormData({ foodName: "", calories: "", protein: "", carbohydrates: "", fat: "", fiber: "", serving_unit: "", serving_weight_grams: "" });
    } catch (error) {
      alert("Error adding food item: " + error);
    }
  };

  const handleEditClick = (food: any) => {
    setEditFoodItem(food);
    setFormData({
      foodName: food.foodName,
      calories: food.details.calories.toString(),
      protein: food.details.protein.toString(),
      carbohydrates: food.details.carbohydrates.toString(),
      fat: food.details.fat.toString(),
      fiber: food.details.fiber.toString(),
      serving_unit: food.serving_unit,
      serving_weight_grams: food.serving_weight_grams.toString()
    });
    onEditOpen();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
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

    try {
      const response = await fetch(`api/updateCustomFood/${editFoodItem._id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to update food item");

      const responseData = await response.text();
      if (responseData) {
        const data = JSON.parse(responseData);
        if (data.success && data.data) {
          setFoodItems((prev) => prev.map(item => item._id === editFoodItem._id ? data.data : item));
          setStoredFoodItems((prev) => prev.map(item => item._id === editFoodItem._id ? data.data : item));
        }
      }
      onEditClose();
      setFormData({ foodName: "", calories: "", protein: "", carbohydrates: "", fat: "", fiber: "", serving_unit: "", serving_weight_grams: "" });
      setEditFoodItem(null);
    } catch (error) {
      alert("Error updating food item: " + error);
    }
  };

  const handleDelete = async (food: any) => {
    if (window.confirm(`Are you sure you want to delete ${food.foodName}?`)) {
      try {
        const response = await fetch(`api/deleteCustomFood/${food._id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${localStorage.token}`, "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to delete food item");

        setFoodItems((prev) => prev.filter(item => item._id !== food._id));
        setStoredFoodItems((prev) => prev.filter(item => item._id !== food._id));
        onEditClose();
        setFormData({ foodName: "", calories: "", protein: "", carbohydrates: "", fat: "", fiber: "", serving_unit: "", serving_weight_grams: "" });
        setEditFoodItem(null);
      } catch (error) {
        alert("Error deleting food item: " + error);
      }
    }
  };

  const handleTrackClick = (food: any) => {
    navigate(`/trackCustomFood`, { state: { food: food } });
  };

  return (
    <Sidenav>
      <Box textAlign="center" p={6}>
      <HStack justifyContent="space-between" alignItems="center" mb={6}>
          <Heading
            as="h1"
            size="lg"
            color="var(--dark-green)"
            fontWeight="bold"
            letterSpacing="tight"
          >
            Create Your Own Meal
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            variant="solid"
            size="md"
            boxShadow="sm"
            _hover={{ boxShadow: "md", bg: "green.600" }}
            transition="all 0.2s"
            onClick={handleCreateOpen}
          >
            Create a Meal
          </Button>
        </HStack>

        {/* Create Food Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="lg" boxShadow="xl">
            <ModalHeader bg="green.500" p={4}>
            <Heading as="h2" size="md" textAlign="center" color="white">
                Add Food Item
              </Heading>
            </ModalHeader>
            <ModalBody p={6}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  {Object.keys(formData).map((key) => (
                    <FormControl key={key} isRequired={["foodName", "serving_unit", "calories", "serving_weight_grams"].includes(key)}>
                      <FormLabel htmlFor={key} textTransform="capitalize">
                        {key === "foodName"
                          ? "Food name"
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
                        borderColor="gray.300"
                        _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--dark-green)" }}
                      />
                    </FormControl>
                  ))}
                </VStack>
              </form>
            </ModalBody>
            <ModalFooter>
            <Button
                colorScheme="green"
                type="submit"
                onClick={handleSubmit}
              >                Add Food Item
              </Button>
              <Button onClick={onCreateClose} ml={3} colorScheme="red">
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Food Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg="green.500" p={4}>
              <Heading as="h2" size="md" textAlign="center" color="white">Edit Food Item</Heading>
            </ModalHeader>
            <ModalBody mt={4} p={6}>
              <form onSubmit={handleEditSubmit}>
                <VStack spacing={4}>
                  {Object.keys(formData).map((key) => (
                    <FormControl key={key} isRequired={["foodName", "serving_unit", "calories", "serving_weight_grams"].includes(key)}>
                      <FormLabel htmlFor={key} textTransform="capitalize">
                        {key === "foodName"
                          ? "Food name"
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
              <Button colorScheme="green" type="submit" onClick={handleEditSubmit}>
                Save Changes
              </Button>
              <Button onClick={onEditClose} ml={3} colorScheme="red">
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Display Added Food Items */}
        <List spacing={3} mt={20}>
          {allFoodItems.length === 0 ? (
            <Box>No food items added yet.</Box>
          ) : (
            allFoodItems.map((food, index) => (
              <ListItem
                key={index}
                p={3}
                borderWidth={1}
                borderRadius="md"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                _hover={{ bg: "gray.100" }}
                data-testid={`food-item-${food.foodName}`}
              >
                <Box flex="1">
                  <strong>{food.foodName}</strong> - {food.details.calories} cal per {food.serving_unit}
                </Box>
                <Menu>
                  <Tooltip label="More actions" placement="top">
                    <MenuButton
                      as={IconButton}
                      aria-label="More actions"
                      icon={<ChevronDownIcon />}
                      size="sm"
                      color="var(--dark-green)" // Match app theme
                      variant="outline"
                      borderRadius="full" // Circular button
                      _hover={{ bg: "green.50", color: "green.700" }} // Subtle hover effect
                      transition="all 0.2s"
                    />
                  </Tooltip>
                  <MenuList
                    borderColor="green.200"
                    boxShadow="md"
                    minWidth="150px" // Slightly wider for readability
                  >
                    <MenuItem
                      icon={<AddIcon />}
                      onClick={() => handleTrackClick(food)}
                      _hover={{ bg: "green.50", color: "var(--dark-green)" }}
                    >
                      Track
                    </MenuItem>
                    <MenuItem
                      icon={<EditIcon />}
                      onClick={() => handleEditClick(food)}
                      _hover={{ bg: "green.50", color: "var(--dark-green)" }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(food)}
                      _hover={{ bg: "red.50", color: "red.600" }} // Red hover for delete
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Sidenav>
  );
};

export default CreateCustomFoodPage;