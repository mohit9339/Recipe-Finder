// src/api/fetchRecipes.js

const fetchRecipes = async (query) => {
  console.log("App ID:", process.env.NEXT_PUBLIC_EDAMAM_APP_ID);
console.log("App Key:", process.env.NEXT_PUBLIC_EDAMAM_API_KEY);
const app_id = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
  const app_key = process.env.NEXT_PUBLIC_EDAMAM_API_KEY;
    console.log(app_id);
    
  
    try {
      const response = await fetch(
        `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${app_id}&app_key=${app_key}`
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes`);
      }
  
      const data = await response.json();
      return data.hits;
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      return [];
    }
  };
  
  export default fetchRecipes;
  