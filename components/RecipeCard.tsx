
import React from 'react';
import type { Recipe } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ListIcon } from './icons/ListIcon';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-brand-card rounded-2xl shadow-lg overflow-hidden border border-brand-subtle/30 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="font-serif text-2xl font-bold text-brand-primary mb-2">{recipe.recipeName}</h3>
        <p className="text-brand-text/80 mb-6">{recipe.description}</p>
        
        <div className="mb-6">
          <h4 className="flex items-center text-lg font-semibold mb-3 text-brand-text">
            <ListIcon className="w-5 h-5 mr-2 text-brand-secondary" />
            Ingredients
          </h4>
          <ul className="list-disc list-inside space-y-1 text-brand-text/90 pl-2">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="flex items-center text-lg font-semibold mb-3 text-brand-text">
            <BookOpenIcon className="w-5 h-5 mr-2 text-brand-secondary" />
            Instructions
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-brand-text/90 pl-2">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
