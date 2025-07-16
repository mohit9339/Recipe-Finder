// src/app/components/RecipeCard.jsx
const RecipeCard = ({ recipe }) => {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.label}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {recipe.label}
          </h2>
          <p className="text-gray-600 mt-2">
            Calories: {Math.round(recipe.calories)}
          </p>
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-blue-600 hover:underline"
          >
            View Recipe
          </a>
        </div>
      </div>
    );
  };
  
  export default RecipeCard;
  