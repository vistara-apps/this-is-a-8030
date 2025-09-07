// OpenAI service for recipe generation
// Supports both mock and real API implementations

import OpenAI from 'openai'

// Configuration
const USE_REAL_API = false // Set to true to use real OpenAI API
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const BASE_URL = "https://openrouter.ai/api/v1"

// Initialize OpenAI client (only if using real API)
let openai = null
if (USE_REAL_API && API_KEY) {
  openai = new OpenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
    dangerouslyAllowBrowser: true,
  })
}

// Mock recipes for demo purposes
const mockRecipes = [
  {
    title: 'Creamy Chicken and Rice Bowl',
    description: 'A comforting one-bowl meal with tender chicken, fluffy rice, and fresh vegetables',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    ingredients: [
      '2 chicken breasts, diced',
      '1 cup jasmine rice',
      '2 cups chicken broth',
      '1 medium onion, diced',
      '2 cloves garlic, minced',
      '1 cup broccoli florets',
      '1/2 cup heavy cream',
      '2 tbsp olive oil',
      'Salt and pepper to taste',
      '1/4 cup grated parmesan cheese'
    ],
    instructions: [
      'Heat olive oil in a large skillet over medium-high heat.',
      'Season chicken with salt and pepper, then cook until golden brown and cooked through, about 6-8 minutes.',
      'Remove chicken and set aside. In the same pan, sauté onion until translucent.',
      'Add garlic and cook for 1 minute until fragrant.',
      'Add rice and stir to coat with oil for 2 minutes.',
      'Pour in chicken broth, bring to a boil, then reduce heat and simmer covered for 15 minutes.',
      'Add broccoli in the last 5 minutes of cooking.',
      'Stir in cooked chicken, cream, and parmesan cheese.',
      'Let rest for 5 minutes before serving. Garnish with additional parmesan if desired.'
    ],
    tags: ['One-Bowl', 'Comfort Food', 'Easy', 'Family-Friendly'],
    nutritionInfo: {
      calories: 485,
      protein: 32,
      carbs: 45,
      fat: 18,
      fiber: 3
    }
  },
  {
    title: 'Mediterranean Pasta Primavera',
    description: 'Fresh vegetables and herbs tossed with pasta in a light, flavorful sauce',
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    ingredients: [
      '12 oz whole wheat pasta',
      '2 medium tomatoes, diced',
      '1 zucchini, sliced',
      '1 bell pepper, strips',
      '1/2 red onion, sliced',
      '3 cloves garlic, minced',
      '1/4 cup olive oil',
      '1/4 cup fresh basil, chopped',
      '2 tbsp fresh oregano',
      '1/4 cup pine nuts',
      'Salt and pepper to taste',
      'Feta cheese for serving'
    ],
    instructions: [
      'Cook pasta according to package directions until al dente. Reserve 1/2 cup pasta water.',
      'Heat olive oil in a large pan over medium heat.',
      'Sauté onion and bell pepper until softened, about 5 minutes.',
      'Add zucchini and garlic, cook for 3 more minutes.',
      'Add tomatoes, oregano, salt, and pepper. Cook until tomatoes break down slightly.',
      'Toss in cooked pasta with a splash of pasta water.',
      'Remove from heat and stir in fresh basil and pine nuts.',
      'Serve topped with crumbled feta cheese.'
    ],
    tags: ['Mediterranean', 'Vegetarian', 'Fresh', 'Healthy'],
    nutritionInfo: {
      calories: 420,
      protein: 14,
      carbs: 65,
      fat: 14,
      fiber: 8
    }
  },
  {
    title: 'Spicy Beef and Potato Stir-Fry',
    description: 'Quick and flavorful stir-fry with tender beef strips and crispy potatoes',
    prepTime: 12,
    cookTime: 18,
    servings: 4,
    ingredients: [
      '1 lb beef sirloin, sliced thin',
      '3 medium potatoes, cubed',
      '1 onion, sliced',
      '2 bell peppers, strips',
      '3 cloves garlic, minced',
      '2 tbsp soy sauce',
      '1 tbsp chili sauce',
      '2 tbsp vegetable oil',
      '1 tsp paprika',
      '1/2 tsp cumin',
      'Green onions for garnish',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Parboil potato cubes for 8 minutes until just tender. Drain well.',
      'Heat 1 tbsp oil in a large wok or skillet over high heat.',
      'Stir-fry beef strips until browned, about 3-4 minutes. Remove and set aside.',
      'Add remaining oil and stir-fry potatoes until golden and crispy.',
      'Add onions and bell peppers, stir-fry for 3 minutes.',
      'Add garlic, paprika, and cumin, cook for 1 minute.',
      'Return beef to pan, add soy sauce and chili sauce.',
      'Toss everything together for 2 minutes until heated through.',
      'Garnish with sliced green onions before serving.'
    ],
    tags: ['Spicy', 'Quick', 'Protein-Rich', 'Satisfying'],
    nutritionInfo: {
      calories: 520,
      protein: 28,
      carbs: 35,
      fat: 28,
      fiber: 4
    }
  },
  {
    title: 'Garden Vegetable Pasta',
    description: 'Fresh seasonal vegetables tossed with pasta in a light herb sauce',
    prepTime: 8,
    cookTime: 15,
    servings: 3,
    ingredients: [
      '12 oz pasta of choice',
      '2 zucchini, diced',
      '1 cup cherry tomatoes, halved',
      '1 bell pepper, diced',
      '1/2 red onion, sliced',
      '3 cloves garlic, minced',
      '1/4 cup olive oil',
      '1/4 cup fresh basil',
      '2 tbsp fresh parsley',
      '1/4 cup nutritional yeast',
      'Salt and pepper to taste',
      'Lemon juice to taste'
    ],
    instructions: [
      'Cook pasta according to package directions. Reserve pasta water.',
      'Heat olive oil in a large pan over medium heat.',
      'Sauté onion until translucent, about 3 minutes.',
      'Add bell pepper and zucchini, cook for 5 minutes.',
      'Add garlic and cherry tomatoes, cook for 2 minutes.',
      'Toss in cooked pasta with a splash of pasta water.',
      'Remove from heat and stir in herbs and nutritional yeast.',
      'Season with salt, pepper, and lemon juice.',
      'Serve immediately while hot.'
    ],
    tags: ['Vegan', 'Fresh', 'Light', 'Quick'],
    nutritionInfo: {
      calories: 380,
      protein: 12,
      carbs: 68,
      fat: 8,
      fiber: 6
    }
  }
]

// Recipe generation service
export class OpenAIService {
  constructor() {
    this.useRealAPI = USE_REAL_API && openai !== null
    this.rateLimitDelay = 1000 // 1 second between requests
    this.lastRequestTime = 0
  }

  async generateRecipe(ingredients, userPreferences = {}) {
    // Rate limiting
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest))
    }
    this.lastRequestTime = Date.now()

    if (this.useRealAPI) {
      return await this.generateRealRecipe(ingredients, userPreferences)
    } else {
      return await this.generateMockRecipe(ingredients, userPreferences)
    }
  }

  async generateRealRecipe(ingredients, userPreferences) {
    const prompt = this.buildPrompt(ingredients, userPreferences)
    
    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const recipeText = completion.choices[0].message.content
      const recipe = this.parseRecipeResponse(recipeText)
      
      return this.enhanceRecipe(recipe, ingredients, userPreferences)
    } catch (error) {
      console.error('OpenAI API error:', error)
      
      // Fallback to mock recipe if API fails
      console.log('Falling back to mock recipe generation')
      return await this.generateMockRecipe(ingredients, userPreferences)
    }
  }

  async generateMockRecipe(ingredients, userPreferences) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Select recipe based on ingredients and preferences
    let selectedRecipe = this.selectBestMockRecipe(ingredients, userPreferences)
    
    // Customize recipe based on user preferences
    selectedRecipe = this.customizeRecipe(selectedRecipe, userPreferences)
    
    return this.enhanceRecipe(selectedRecipe, ingredients, userPreferences)
  }

  selectBestMockRecipe(ingredients, userPreferences) {
    const lowerIngredients = ingredients.toLowerCase()
    
    // Check dietary preferences first
    if (userPreferences.dietaryPreferences?.includes('Vegetarian') || 
        userPreferences.dietaryPreferences?.includes('Vegan')) {
      return { ...mockRecipes[3] } // Garden Vegetable Pasta
    }
    
    // Match based on ingredients
    if (lowerIngredients.includes('chicken') && lowerIngredients.includes('rice')) {
      return { ...mockRecipes[0] }
    } else if (lowerIngredients.includes('pasta') || lowerIngredients.includes('tomato')) {
      return { ...mockRecipes[1] }
    } else if (lowerIngredients.includes('beef') || lowerIngredients.includes('potato')) {
      return { ...mockRecipes[2] }
    } else {
      // Random recipe if no match
      return { ...mockRecipes[Math.floor(Math.random() * mockRecipes.length)] }
    }
  }

  customizeRecipe(recipe, userPreferences) {
    let customizedRecipe = { ...recipe }
    
    // Handle allergies
    if (userPreferences.allergies?.includes('Dairy')) {
      customizedRecipe.ingredients = customizedRecipe.ingredients.filter(
        ingredient => !this.containsDairy(ingredient)
      )
      customizedRecipe.instructions = customizedRecipe.instructions.map(
        instruction => instruction.replace(/cream|cheese|milk|butter/gi, 'dairy-free alternative')
      )
      customizedRecipe.title += ' (Dairy-Free)'
    }
    
    if (userPreferences.allergies?.includes('Gluten')) {
      customizedRecipe.ingredients = customizedRecipe.ingredients.map(
        ingredient => ingredient.replace(/pasta|flour|bread/gi, 'gluten-free $&')
      )
      customizedRecipe.title += ' (Gluten-Free)'
    }
    
    if (userPreferences.allergies?.includes('Nuts')) {
      customizedRecipe.ingredients = customizedRecipe.ingredients.filter(
        ingredient => !this.containsNuts(ingredient)
      )
    }
    
    // Adjust for calorie goals
    if (userPreferences.calorieGoal) {
      customizedRecipe = this.adjustForCalories(customizedRecipe, userPreferences.calorieGoal)
    }
    
    return customizedRecipe
  }

  containsDairy(ingredient) {
    const dairyKeywords = ['cream', 'cheese', 'milk', 'butter', 'yogurt', 'sour cream']
    return dairyKeywords.some(keyword => ingredient.toLowerCase().includes(keyword))
  }

  containsNuts(ingredient) {
    const nutKeywords = ['nuts', 'almond', 'walnut', 'pecan', 'pine nuts', 'peanut', 'cashew']
    return nutKeywords.some(keyword => ingredient.toLowerCase().includes(keyword))
  }

  adjustForCalories(recipe, calorieGoal) {
    const currentCalories = recipe.nutritionInfo?.calories || 400
    
    if (calorieGoal < currentCalories * 0.8) {
      // Reduce portions
      recipe.title += ' (Light Portion)'
      recipe.description += ' - Adjusted for lower calorie intake'
      recipe.servings = Math.ceil(recipe.servings * 1.3)
    } else if (calorieGoal > currentCalories * 1.2) {
      // Add more ingredients
      recipe.title += ' (Hearty Portion)'
      recipe.description += ' - Enhanced for higher calorie needs'
      recipe.servings = Math.max(1, Math.floor(recipe.servings * 0.8))
    }
    
    return recipe
  }

  buildPrompt(ingredients, userPreferences) {
    const { dietaryPreferences = [], allergies = [], calorieGoal } = userPreferences
    
    return `Create a delicious recipe using these ingredients: ${ingredients}.
    
User preferences:
- Dietary restrictions: ${dietaryPreferences.join(', ') || 'None'}
- Allergies: ${allergies.join(', ') || 'None'}
- Calorie goal: ${calorieGoal || 'Not specified'}

Please provide a JSON response with this exact structure:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "prepTime": 15,
  "cookTime": 25,
  "servings": 4,
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "tags": ["tag1", "tag2"],
  "nutritionInfo": {
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 15,
    "fiber": 5
  }
}

Make sure the recipe is safe for the user's allergies and follows their dietary preferences.`
  }

  parseRecipeResponse(responseText) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      // If no JSON found, throw error to trigger fallback
      throw new Error('No valid JSON found in response')
    } catch (error) {
      console.error('Failed to parse recipe response:', error)
      throw error
    }
  }

  enhanceRecipe(recipe, originalIngredients, userPreferences) {
    return {
      ...recipe,
      id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      generatedAt: new Date(),
      originalIngredients,
      userPreferences,
      estimatedCost: this.calculateCost(recipe),
      difficulty: this.calculateDifficulty(recipe),
      nutritionInfo: recipe.nutritionInfo || this.estimateNutrition(recipe)
    }
  }

  calculateCost(recipe) {
    const basePrice = 0.20
    const complexityMultiplier = recipe.ingredients?.length > 8 ? 1.5 : 1.0
    const timeMultiplier = (recipe.prepTime + recipe.cookTime) > 45 ? 1.3 : 1.0
    
    return Math.round(basePrice * complexityMultiplier * timeMultiplier * 100) / 100
  }

  calculateDifficulty(recipe) {
    const ingredientCount = recipe.ingredients?.length || 0
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
    const instructionCount = recipe.instructions?.length || 0
    
    if (ingredientCount <= 5 && totalTime <= 30 && instructionCount <= 6) {
      return 'Easy'
    } else if (ingredientCount <= 10 && totalTime <= 60 && instructionCount <= 10) {
      return 'Medium'
    } else {
      return 'Hard'
    }
  }

  estimateNutrition(recipe) {
    // Basic nutrition estimation based on ingredients
    // In a real app, this would use a nutrition database
    return {
      calories: 400,
      protein: 20,
      carbs: 45,
      fat: 15,
      fiber: 5
    }
  }

  async customizeExistingRecipe(recipe, customization, userPreferences) {
    const prompt = `Modify this recipe based on the user's request: "${customization}"

Original Recipe:
Title: ${recipe.title}
Ingredients: ${recipe.ingredients?.join(', ')}
Instructions: ${recipe.instructions?.join(' ')}

User preferences:
- Dietary restrictions: ${userPreferences.dietaryPreferences?.join(', ') || 'None'}
- Allergies: ${userPreferences.allergies?.join(', ') || 'None'}

Please provide the modified recipe in the same JSON format as before.`

    if (this.useRealAPI) {
      try {
        const completion = await openai.chat.completions.create({
          model: "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        })

        const recipeText = completion.choices[0].message.content
        return this.parseRecipeResponse(recipeText)
      } catch (error) {
        console.error('Recipe customization failed:', error)
      }
    }
    
    // Fallback: simple text-based customization
    return this.mockCustomizeRecipe(recipe, customization)
  }

  mockCustomizeRecipe(recipe, customization) {
    const customizedRecipe = { ...recipe }
    const lowerCustomization = customization.toLowerCase()
    
    if (lowerCustomization.includes('spic')) {
      customizedRecipe.title += ' (Spicy)'
      customizedRecipe.ingredients.push('1 tsp red pepper flakes')
      customizedRecipe.tags.push('Spicy')
    }
    
    if (lowerCustomization.includes('less oil') || lowerCustomization.includes('healthier')) {
      customizedRecipe.title += ' (Light)'
      customizedRecipe.ingredients = customizedRecipe.ingredients.map(
        ingredient => ingredient.replace(/(\d+)\s*tbsp\s*oil/gi, '1 tbsp oil')
      )
      customizedRecipe.tags.push('Light')
    }
    
    if (lowerCustomization.includes('more protein')) {
      customizedRecipe.title += ' (High Protein)'
      customizedRecipe.ingredients.push('Extra protein of choice')
      customizedRecipe.tags.push('High-Protein')
    }
    
    customizedRecipe.id = `recipe_${Date.now()}_customized`
    customizedRecipe.customization = customization
    customizedRecipe.originalRecipeId = recipe.id
    
    return customizedRecipe
  }
}

// Create singleton instance
const openaiService = new OpenAIService()

export default openaiService

// Export convenience function
export const generateRecipe = (ingredients, userPreferences) => 
  openaiService.generateRecipe(ingredients, userPreferences)

export const customizeRecipe = (recipe, customization, userPreferences) =>
  openaiService.customizeExistingRecipe(recipe, customization, userPreferences)
