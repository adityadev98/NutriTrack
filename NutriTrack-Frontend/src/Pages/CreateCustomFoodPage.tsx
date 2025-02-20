
// import {Button, Input, FormControl,FormLabel,Modal,ModalOverlay, ModalContent,ModalHeader,ModalBody, ModalFooter,
//   useDisclosure,
//   VStack,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
// } from "@chakra-ui/react";

import React, { useState, useEffect} from "react";

const CreateCustomFoodPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [storedFoodItems, setStoredFoodItems] = useState([]);  // Fetched from DB
  const [formData, setFormData] = useState({
    foodName: "",
    servingUnit: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    fiber: "",
  });

  useEffect(() => {
    fetch("http://localhost:7001/getCustomFood")
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetched stored food items:", data);
            setStoredFoodItems(data);
        })
        .catch((error) => console.error("Error fetching custom foods:", error));
}, []);


  useEffect(() => {
    console.log("Updated foodItems:", foodItems);
  }, [foodItems]);

  // Merge stored food items and newly added ones
  const allFoodItems = [...storedFoodItems, ...foodItems];

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.foodName || !formData.servingUnit || !formData.calories) {
      alert("Food name, serving unit, and calories are required!");
      return;
    }

    const requestBody = {
        userId: "6792c1e74bfde7cb9da062de", // Replace with dynamic user ID 
        foodName: formData.foodName,
        details: {
          calories: Number(formData.calories),
          protein: Number(formData.protein) || 0,
          carbohydrates: Number(formData.carbohydrates) || 0,
          fat: Number(formData.fat) || 0,
          fiber: Number(formData.fiber) || 0,
        },
        servingUnit: formData.servingUnit
      };
  
      try {
        const response = await fetch("http://localhost:7001/customFood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) throw new Error("Failed to add food item");
  
        const responseData = await response.json();
        if (responseData.success && responseData.data) {
            setFoodItems((prevFoodItems) => [...prevFoodItems, responseData.data]);
          }       
          
        setIsOpen(false);
        setFormData({ foodName: "", servingUnit: "", calories: "", protein: "", carbohydrates: "", fat: "", fiber: "" });
    } catch (error) {
        console.error(error);
        alert("Error adding food item.");
      }

      console.log("foodItems",foodItems);
      console.log("setFormData",setFormData);
    };

  return (
    <div style={styles.container}>
      <h1>Create Your Own Meal</h1>
      <button onClick={() => setIsOpen(true)} style={styles.button}>
        Create a Meal
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Add Food Item</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="foodName">Food Name*:</label>
                <input type="text" id="foodName" name="foodName" value={formData.foodName} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="servingUnit">Serving Unit*:</label>
                <input type="text" id="servingUnit" name="servingUnit" value={formData.servingUnit} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="calories">Calories*:</label>
                <input type="number" id="calories" name="calories" value={formData.calories} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="protein">Protein:</label>
                <input type="number" id="protein" name="protein" value={formData.protein} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="carbs">Carbs:</label>
                <input type="number" id="carbohydrates" name="carbohydrates" value={formData.carbohydrates} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="fat">Fat:</label>
                <input type="number" id="fat" name="fat" value={formData.fat} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="fiber">Fiber:</label>
                <input type="number" id="fiber" name="fiber" value={formData.fiber} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.buttonContainer}>
                <button type="submit" style={styles.button}>Add Food Item</button>
                <button onClick={() => setIsOpen(false)} style={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display added food items */}
      <div>
            <h2>Added Food Items</h2>
            {allFoodItems.length === 0 ? (
                <p>No food items added yet.</p>
            ) : (
                <ul style={styles.list}>
                    {allFoodItems.map((food, index) => (
                        <li key={index} style={styles.listItem}>
                            <strong>{food.foodName}</strong> - {food.details.calories} cal per {food.servingUnit}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
  );
};

// Improved styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  button: {
    padding: "10px 15px",
    margin: "10px",
    background: "#007BFF",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  },
  cancelButton: {
    padding: "10px 15px",
    margin: "10px",
    background: "#FF4D4D",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    marginBottom: "10px",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginTop: "4px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    background: "#f4f4f4",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
  },
};

export default CreateCustomFoodPage;