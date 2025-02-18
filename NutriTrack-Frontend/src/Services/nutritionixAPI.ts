const NUTRITIONIX_APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;

const headers = {
  "x-app-id": NUTRITIONIX_APP_ID,
  "x-app-key": NUTRITIONIX_API_KEY,
  "Content-Type": "application/json",
};

export async function searchFoodAPI(query: string) {
  try {
    const response = await fetch("https://trackapi.nutritionix.com/v2/search/instant", {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return data.common || [];
  } catch (error) {
    console.error("Error fetching food data:", error);
    return [];
  }
}

export async function fetchFoodDetailsAPI(foodName: string) {
  try {
    const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
      method: "POST",
      headers,
      body: JSON.stringify({ query: foodName }),
    });

    const data = await response.json();
    if (data.foods && data.foods.length > 0) {
      return data.foods[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching food details:", error);
    return null;
  }
}
