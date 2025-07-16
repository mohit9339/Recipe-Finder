import ReactMarkdown from 'react-markdown';

const AIRecipeContent = ({ recipe }) => {
  return (
    <div className="w-full bg-purple-50 p-6 rounded-lg">
      <span className="text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
        AI-Generated
      </span>
      <h2 className="text-2xl font-bold text-purple-800 mt-2 mb-4">{recipe.label}</h2>
      <div className="prose prose-sm sm:prose lg:prose-lg prose-purple max-w-none">
        <ReactMarkdown>{recipe.description}</ReactMarkdown>
      </div>
    </div>
  );
};

export default AIRecipeContent;
