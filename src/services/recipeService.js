// Recipe generation service
// Integrates with OpenAI service for intelligent recipe generation

import openaiService from './openaiService'
import supabaseService from './supabaseService'

export const generateRecipe = async (ingredients, user) => {
  try {
    // Use the enhanced OpenAI service for recipe generation
    const recipe = await openaiService.generateRecipe(ingredients, {
      dietaryPreferences: user.dietaryPreferences,
      allergies: user.allergies,
      calorieGoal: user.calorieGoal
    })
    
    // Save the generated recipe to the database
    try {
      await supabaseService.createRecipe({
        recipe_id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        ingredients_used: recipe.ingredients,
        instructions: recipe.instructions,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        tags: recipe.tags
      })
    } catch (dbError) {
      console.warn('Failed to save recipe to database:', dbError)
      // Continue without saving to database
    }
    
    return recipe
  } catch (error) {
    console.error('Recipe generation failed:', error)
    throw new Error('Failed to generate recipe. Please try again.')
  }
}

export const customizeRecipe = async (recipe, customization, user) => {
  try {
    const customizedRecipe = await openaiService.customizeExistingRecipe(
      recipe, 
      customization, 
      {
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies,
        calorieGoal: user.calorieGoal
      }
    )
    
    // Save the customized recipe to the database
    try {
      await supabaseService.createRecipe({
        recipe_id: customizedRecipe.id,
        title: customizedRecipe.title,
        description: customizedRecipe.description,
        ingredients_used: customizedRecipe.ingredients,
        instructions: customizedRecipe.instructions,
        prep_time: customizedRecipe.prepTime,
        cook_time: customizedRecipe.cookTime,
        tags: customizedRecipe.tags
      })
    } catch (dbError) {
      console.warn('Failed to save customized recipe to database:', dbError)
    }
    
    return customizedRecipe
  } catch (error) {
    console.error('Recipe customization failed:', error)
    throw new Error('Failed to customize recipe. Please try again.')
  }
}

export const saveRecipeForUser = async (userId, recipe) => {
  try {
    await supabaseService.saveRecipeForUser(userId, recipe.id)
    return true
  } catch (error) {
    console.error('Failed to save recipe for user:', error)
    return false
  }
}

export const unsaveRecipeForUser = async (userId, recipeId) => {
  try {
    await supabaseService.unsaveRecipeForUser(userId, recipeId)
    return true
  } catch (error) {
    console.error('Failed to unsave recipe for user:', error)
    return false
  }
}

export const getUserSavedRecipes = async (userId) => {
  try {
    return await supabaseService.getUserRecipes(userId)
  } catch (error) {
    console.error('Failed to get user saved recipes:', error)
    return []
  }
}

export const searchRecipes = async (query, filters = {}) => {
  try {
    return await supabaseService.searchRecipes(query, filters)
  } catch (error) {
    console.error('Failed to search recipes:', error)
    return []
  }
}

// Real OpenAI integration (commented out for demo)
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const generateRecipe = async (ingredients, user) => {
  const prompt = `Create a delicious recipe using these ingredients: ${ingredients}.
  
  User preferences:
  - Dietary restrictions: ${user.dietaryPreferences?.join(', ') || 'None'}
  - Allergies: ${user.allergies?.join(', ') || 'None'}
  - Calorie goal: ${user.calorieGoal || 'Not specified'}
  
  Please provide a JSON response with:
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "prepTime": 15,
    "cookTime": 25,
    "servings": 4,
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["step 1", "step 2"],
    "tags": ["tag1", "tag2"]
  }`;

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const recipeText = completion.choices[0].message.content;
    return JSON.parse(recipeText);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate recipe');
  }
};
*/
