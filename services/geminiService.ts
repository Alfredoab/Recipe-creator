
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "The title of the recipe.",
      },
      description: {
        type: Type.STRING,
        description: "A short, appealing description of the dish, under 30 words.",
      },
      ingredients: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of all ingredients needed for the recipe, including pantry staples.",
      },
      instructions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Step-by-step cooking instructions.",
      },
    },
    required: ["recipeName", "description", "ingredients", "instructions"],
  },
};

export const generateRecipes = async (ingredients: string): Promise<Recipe[]> => {
  const prompt = `
    You are a creative and experienced chef. Based on the following ingredients, generate 3 distinct and delicious recipes.
    Provide a brief, enticing description for each recipe.
    You can assume common pantry staples like salt, pepper, oil, flour, sugar, and water are available, so include them in the recipe if needed.
    The user has the following ingredients available: ${ingredients}.
    Ensure your response strictly follows the provided JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const responseText = response.text.trim();
    if (!responseText) {
      throw new Error("Received an empty response from the AI. Try rephrasing your ingredients.");
    }
    
    const parsedRecipes: Recipe[] = JSON.parse(responseText);
    return parsedRecipes;

  } catch (error) {
    console.error("Error generating recipes:", error);
    // Enhance error message for user
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the recipe data from the AI. Please try again.");
    }
    throw new Error("Could not generate recipes. The AI may be busy or the request could not be processed. Please try again later.");
  }
};
