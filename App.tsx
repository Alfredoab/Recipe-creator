
import React, { useState, useCallback } from 'react';
import { generateRecipes } from './services/geminiService';
import type { Recipe } from './types';
import { ChefHatIcon } from './components/icons/ChefHatIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { RecipeCard } from './components/RecipeCard';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const exampleIngredients = "chicken breast, broccoli, rice, soy sauce, garlic";

  const handleGenerateRecipes = useCallback(async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const result = await generateRecipes(ingredients);
      setRecipes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [ingredients]);

  const handleClear = () => {
    setIngredients('');
    setRecipes([]);
    setError(null);
    setIsLoading(false);
  };

  const fillExample = () => {
    setIngredients(exampleIngredients);
  };

  return (
    <div className="min-h-screen font-sans text-brand-text">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-4">
            <ChefHatIcon className="w-16 h-16 text-brand-primary" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-brand-text">Gemini Chef</h1>
          </div>
          <p className="text-lg text-brand-text/80 max-w-2xl mx-auto">
            Turn your pantry treasures into culinary masterpieces. What ingredients do you have today?
          </p>
        </header>

        <main>
          <div className="max-w-2xl mx-auto bg-brand-card p-6 md:p-8 rounded-2xl shadow-lg border border-brand-subtle/30">
            <div className="flex flex-col space-y-4">
              <label htmlFor="ingredients" className="text-lg font-semibold text-brand-text">
                Your Ingredients
              </label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., chicken breast, broccoli, carrots, soy sauce..."
                className="w-full p-4 border border-brand-subtle rounded-xl h-36 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                rows={4}
                disabled={isLoading}
              />
               <div className="text-sm text-gray-500">
                Don't have anything? <button onClick={fillExample} className="text-brand-primary hover:underline font-medium">Try an example</button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerateRecipes}
                  disabled={isLoading || !ingredients.trim()}
                  className="w-full flex justify-center items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition duration-300 disabled:bg-brand-primary/50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>{isLoading ? 'Crafting Recipes...' : 'Generate Recipes'}</span>
                </button>
                 <button
                  onClick={handleClear}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition duration-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {!isLoading && recipes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} />
                ))}
              </div>
            )}
            {!isLoading && recipes.length === 0 && !error && (
               <div className="text-center py-16 px-6 bg-brand-card/50 rounded-2xl">
                <ChefHatIcon className="w-20 h-20 text-brand-subtle mx-auto mb-4"/>
                <h2 className="text-2xl font-bold mb-2">Your next meal awaits!</h2>
                <p className="text-brand-text/70">Enter your ingredients above and let's get cooking.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
