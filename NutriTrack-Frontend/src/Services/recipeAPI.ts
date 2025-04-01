export async function fetchMealsByName(query: string) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error('Failed to fetch meals:', error);
        return [];
    }
}


export async function fetchMealsByFilter(type: 'category' | 'area', query: string) {
    try {
        let url = '';
        if (type === 'category') {
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${query}`;
        } else if (type === 'area') {
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${query}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error('Failed to fetch filtered meals:', error);
        return [];
    }
}

export async function fetchRecipeDetails(id: string) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error('Failed to fetch recipe details:', error);
        return null;
    }
}


export async function fetchCategoriesByName() {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return data.meals.map((meal: { strCategory: string }) => meal.strCategory) || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export async function fetchArea() {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.meals.map((meal: { strArea: string }) => meal.strArea) || [];
    } catch (error) {
        console.error("Failed to fetch area:", error);
        return [];
    }
}
