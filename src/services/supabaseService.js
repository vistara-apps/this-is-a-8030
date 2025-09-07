// Supabase service for backend data management
// This would integrate with Supabase in production

// Mock implementation for demo purposes
// In production, this would use the Supabase client

class SupabaseService {
  constructor() {
    this.users = new Map()
    this.recipes = new Map()
    this.ingredients = new Map()
    this.initialized = false
    this.init()
  }

  async init() {
    if (this.initialized) return
    
    // Load data from localStorage for demo
    try {
      const usersData = localStorage.getItem('supabase_users')
      const recipesData = localStorage.getItem('supabase_recipes')
      const ingredientsData = localStorage.getItem('supabase_ingredients')
      
      if (usersData) {
        const users = JSON.parse(usersData)
        users.forEach(user => this.users.set(user.user_id, user))
      }
      
      if (recipesData) {
        const recipes = JSON.parse(recipesData)
        recipes.forEach(recipe => this.recipes.set(recipe.recipe_id, recipe))
      }
      
      if (ingredientsData) {
        const ingredients = JSON.parse(ingredientsData)
        ingredients.forEach(ingredient => this.ingredients.set(ingredient.ingredient_id, ingredient))
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error)
    }
    
    this.initialized = true
  }

  // Save data to localStorage (simulating database persistence)
  async saveToStorage() {
    try {
      localStorage.setItem('supabase_users', JSON.stringify(Array.from(this.users.values())))
      localStorage.setItem('supabase_recipes', JSON.stringify(Array.from(this.recipes.values())))
      localStorage.setItem('supabase_ingredients', JSON.stringify(Array.from(this.ingredients.values())))
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
    }
  }

  // User Management
  async createUser(userData) {
    await this.init()
    
    const user = {
      user_id: userData.user_id || `user_${Date.now()}`,
      dietary_preferences: userData.dietary_preferences || [],
      allergies: userData.allergies || [],
      calorie_goal: userData.calorie_goal || null,
      saved_recipes: userData.saved_recipes || [],
      onchain_wallet_address: userData.onchain_wallet_address || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.users.set(user.user_id, user)
    await this.saveToStorage()
    return user
  }

  async getUser(userId) {
    await this.init()
    return this.users.get(userId) || null
  }

  async updateUser(userId, updates) {
    await this.init()
    
    const user = this.users.get(userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    const updatedUser = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    this.users.set(userId, updatedUser)
    await this.saveToStorage()
    return updatedUser
  }

  async deleteUser(userId) {
    await this.init()
    
    const deleted = this.users.delete(userId)
    if (deleted) {
      await this.saveToStorage()
    }
    return deleted
  }

  // Recipe Management
  async createRecipe(recipeData) {
    await this.init()
    
    const recipe = {
      recipe_id: recipeData.recipe_id || `recipe_${Date.now()}`,
      title: recipeData.title,
      description: recipeData.description,
      ingredients_used: recipeData.ingredients_used || [],
      instructions: recipeData.instructions,
      prep_time: recipeData.prep_time,
      cook_time: recipeData.cook_time,
      tags: recipeData.tags || [],
      saved_by_user_id: recipeData.saved_by_user_id || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.recipes.set(recipe.recipe_id, recipe)
    await this.saveToStorage()
    return recipe
  }

  async getRecipe(recipeId) {
    await this.init()
    return this.recipes.get(recipeId) || null
  }

  async getUserRecipes(userId) {
    await this.init()
    
    return Array.from(this.recipes.values()).filter(recipe => 
      recipe.saved_by_user_id.includes(userId)
    )
  }

  async saveRecipeForUser(userId, recipeId) {
    await this.init()
    
    const recipe = this.recipes.get(recipeId)
    if (!recipe) {
      throw new Error('Recipe not found')
    }
    
    if (!recipe.saved_by_user_id.includes(userId)) {
      recipe.saved_by_user_id.push(userId)
      recipe.updated_at = new Date().toISOString()
      this.recipes.set(recipeId, recipe)
      await this.saveToStorage()
    }
    
    return recipe
  }

  async unsaveRecipeForUser(userId, recipeId) {
    await this.init()
    
    const recipe = this.recipes.get(recipeId)
    if (!recipe) {
      throw new Error('Recipe not found')
    }
    
    recipe.saved_by_user_id = recipe.saved_by_user_id.filter(id => id !== userId)
    recipe.updated_at = new Date().toISOString()
    this.recipes.set(recipeId, recipe)
    await this.saveToStorage()
    
    return recipe
  }

  // Ingredient Management
  async createIngredient(ingredientData) {
    await this.init()
    
    const ingredient = {
      ingredient_id: ingredientData.ingredient_id || `ingredient_${Date.now()}`,
      name: ingredientData.name,
      user_id: ingredientData.user_id,
      created_at: new Date().toISOString()
    }
    
    this.ingredients.set(ingredient.ingredient_id, ingredient)
    await this.saveToStorage()
    return ingredient
  }

  async getUserIngredients(userId) {
    await this.init()
    
    return Array.from(this.ingredients.values()).filter(ingredient => 
      ingredient.user_id === userId
    )
  }

  async deleteIngredient(ingredientId) {
    await this.init()
    
    const deleted = this.ingredients.delete(ingredientId)
    if (deleted) {
      await this.saveToStorage()
    }
    return deleted
  }

  // Search and Query Methods
  async searchRecipes(query, filters = {}) {
    await this.init()
    
    let recipes = Array.from(this.recipes.values())
    
    // Text search
    if (query) {
      const lowerQuery = query.toLowerCase()
      recipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }
    
    // Apply filters
    if (filters.tags && filters.tags.length > 0) {
      recipes = recipes.filter(recipe => 
        filters.tags.some(tag => recipe.tags.includes(tag))
      )
    }
    
    if (filters.maxPrepTime) {
      recipes = recipes.filter(recipe => recipe.prep_time <= filters.maxPrepTime)
    }
    
    if (filters.maxCookTime) {
      recipes = recipes.filter(recipe => recipe.cook_time <= filters.maxCookTime)
    }
    
    return recipes
  }

  // Analytics and Stats
  async getUserStats(userId) {
    await this.init()
    
    const userRecipes = await this.getUserRecipes(userId)
    const userIngredients = await this.getUserIngredients(userId)
    
    return {
      totalSavedRecipes: userRecipes.length,
      totalIngredients: userIngredients.length,
      favoriteTag: this.getMostCommonTag(userRecipes),
      averageCookTime: this.getAverageCookTime(userRecipes)
    }
  }

  getMostCommonTag(recipes) {
    const tagCounts = {}
    recipes.forEach(recipe => {
      recipe.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    
    return Object.keys(tagCounts).reduce((a, b) => 
      tagCounts[a] > tagCounts[b] ? a : b, null
    )
  }

  getAverageCookTime(recipes) {
    if (recipes.length === 0) return 0
    
    const totalTime = recipes.reduce((sum, recipe) => 
      sum + (recipe.prep_time || 0) + (recipe.cook_time || 0), 0
    )
    
    return Math.round(totalTime / recipes.length)
  }
}

// Create singleton instance
const supabaseService = new SupabaseService()

export default supabaseService

// Export individual methods for convenience
export const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  createRecipe,
  getRecipe,
  getUserRecipes,
  saveRecipeForUser,
  unsaveRecipeForUser,
  createIngredient,
  getUserIngredients,
  deleteIngredient,
  searchRecipes,
  getUserStats
} = supabaseService
