// src/api/recipes.js
import axios from 'axios';

const fetchRecipes = async (query) => {
  const app_id = import.meta.env.VITE_EDAMAM_APP_ID;
  const app_key = import.meta.env.VITE_EDAMAM_API_KEY;

  try {
    const response = await axios.get(
      `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}`
    );
    return response.data.hits;
  } catch (error) {
    console.error('Failed to fetch recipes', error);
    return [];
  }
};

export default fetchRecipes;
