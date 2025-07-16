'use client';

import { useState, useCallback } from 'react';
import fetchRecipes from '@/api/fetchRecipes';
import Loading from '@/components/Loading';
import RecipeCard from '@/components/RecipeCard';
import { askLLM } from '@/hooks/useAI';
import AIRecipeContent from '@/components/AIResponse';

const Home = () => {
  const [query, setQuery] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredientList, setIngredientList] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAIRecipe, setIsAIRecipe] = useState(false);

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredientList.includes(trimmed.toLowerCase())) {
      setIngredientList([...ingredientList, trimmed.toLowerCase()]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (index) => {
    setIngredientList((prev) => prev.filter((_, i) => i !== index));
  };

  const ingredientString = ingredientList.join(', ');

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setIsAIRecipe(false);

    try {
      const results = await fetchRecipes(query, ingredientString);
      if (results.length === 0) {
        setError('No recipes found. Try different ingredients or dish name.');
      }
      setRecipes(results);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setError('Failed to fetch recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [query, ingredientString]);

 const handleAskAI = useCallback(async () => {
  if (!query.trim() && ingredientList.length === 0) return;

  setLoading(true);
  setError('');
  setIsAIRecipe(true);

  try {
    let prompt = '';

    if (query && ingredientList.length > 0) {
      prompt = `Create a detailed recipe for "${query}" using only the following ingredients: ${ingredientString}.
      
For each ingredient, include:
1. Quantity used
2. Estimated calories before cooking
3. Estimated calories after cooking

Then, provide step-by-step cooking instructions with clear formatting.`;
    } else if (ingredientList.length > 0) {
      prompt = `I have the following ingredients: ${ingredientString}.
Please suggest a complete recipe using them.
Include:
1. Dish name
2. Estimated calories before and after cooking
3. Step-by-step instructions
4. Ingredient quantities`;
    } else if (query) {
      prompt = `Generate a detailed recipe for "${query}".
Include:
1. Ingredients list with quantities
2. Estimated calories before and after cooking
3. Step-by-step instructions.`;
    }

   const aiResult = await fetch('/api/askAI', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt }),
});

const data = await aiResult.json();

if (!aiResult.ok) {
  throw new Error(data.error || 'Something went wrong');
}

const aiText = Array.isArray(data.result)
  ? data.result.join('\n')
  : data.result;


    setRecipes([
      {
        recipe: {
          label: `AI Recipe${query ? `: ${query}` : ''}`,
          description: aiText,
        },
      },
    ]);
  } catch (err) {
    console.error('AI error:', err);
    setError('AI failed to generate a recipe.');
  } finally {
    setLoading(false);
  }
}, [query, ingredientList]);

  return (
    <div
      className="relative min-h-screen text-black flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative container mx-auto p-6 sm:p-10 bg-white bg-opacity-95 rounded-xl shadow-lg z-10 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">🍽️ Smart Recipe Finder</h1>

        <p className="text-center text-gray-600 mb-6">
          Enter a dish name and your available ingredients below.
        </p>

        {/* Dish Name Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What dish do you want to make? (e.g., pasta, biryani)"
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 mb-4"
        />

        {/* Suggested Ingredients */}
        <div className="mb-2">
          <p className="text-sm text-gray-600 mb-1">Suggested:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Tomato',
              'Onion',
              'Garlic',
              'Chicken',
              'Rice',
              'Cheese',
              'Egg',
              'Salt',
              'Bread',
              'Butter',
            ].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const val = item.toLowerCase();
                  if (!ingredientList.includes(val)) {
                    setIngredientList([...ingredientList, val]);
                  }
                }}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient Chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {ingredientList.map((ingredient, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        {/* Manual Ingredient Entry */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addIngredient();
              }
            }}
            placeholder="Type any other ingredient and press Enter"
            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={addIngredient}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap mb-6">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg transition active:scale-95"
          >
            Search Recipes
          </button>
          <button
            onClick={handleAskAI}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition active:scale-95"
          >
            Ask AI to Create Recipe
          </button>
        </div>

        {/* Loading */}
        {loading && <Loading />}

        {/* Error */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Normal API Recipes */}
        {!loading && recipes.length > 0 && !isAIRecipe && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe.recipe} />
            ))}
          </div>
        )}

        {/* AI-Generated Recipe */}
        {!loading && isAIRecipe && recipes.length > 0 && (
          <div className="w-full bg-purple-50 p-6 rounded-lg mt-8">
            <AIRecipeContent recipe={recipes[0].recipe} />
          </div>
        )}

        {/* Default Suggestions */}
        {!loading && recipes.length === 0 && !error && !isAIRecipe && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                img: '/whole.jpg',
                title: 'Mouth-Watering Biryani',
                desc: 'Aromatic spices, basmati rice, and marinated meat or veggies.',
              },
              {
                img: '/pizza.jpg',
                title: 'Mood Lifter: Pizza',
                desc: 'Crispy delight with melted cheese, rich sauce, and tasty toppings.',
              },
              {
                img: '/burger.jpg',
                title: 'Hungry? Go for a Burger!',
                desc: 'Juicy patty, fresh lettuce, tomato, cheese, and soft bun.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
