import React, { createContext, useContext, useState, useEffect } from 'react'
import { generateRecipe } from '../services/recipeService'

const RecipeContext = createContext()

export const useRecipe = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider')
  }
  return context
}

export const RecipeProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [currentIngredients, setCurrentIngredients] = useState([])

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('pantryChef_messages')
    const savedRecipesList = localStorage.getItem('pantryChef_savedRecipes')
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error('Failed to parse saved messages:', error)
      }
    }
    
    if (savedRecipesList) {
      try {
        setSavedRecipes(JSON.parse(savedRecipesList))
      } catch (error) {
        console.error('Failed to parse saved recipes:', error)
      }
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('pantryChef_messages', JSON.stringify(messages))
  }, [messages])

  // Save recipes to localStorage whenever savedRecipes change
  useEffect(() => {
    localStorage.setItem('pantryChef_savedRecipes', JSON.stringify(savedRecipes))
  }, [savedRecipes])

  const addMessage = (message) => {
    const messageWithId = {
      ...message,
      id: Date.now() + Math.random(),
      timestamp: message.timestamp || new Date()
    }
    setMessages(prev => [...prev, messageWithId])
  }

  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem('pantryChef_messages')
  }

  const generateRecipeFromIngredients = async (ingredientsText, user) => {
    try {
      // Extract ingredients from text
      const ingredients = extractIngredients(ingredientsText)
      setCurrentIngredients(ingredients)
      
      // Generate recipe using the service
      const recipe = await generateRecipe(ingredientsText, user)
      
      // Add unique ID and timestamp to recipe
      const recipeWithMeta = {
        ...recipe,
        id: `recipe_${Date.now()}`,
        generatedAt: new Date(),
        ingredientsUsed: ingredients,
        cost: calculateRecipeCost(recipe)
      }
      
      return recipeWithMeta
    } catch (error) {
      console.error('Failed to generate recipe:', error)
      throw error
    }
  }

  const saveRecipe = (recipe) => {
    const recipeToSave = {
      ...recipe,
      savedAt: new Date()
    }
    
    setSavedRecipes(prev => {
      // Check if recipe is already saved
      const exists = prev.find(r => r.id === recipe.id)
      if (exists) {
        return prev // Already saved
      }
      return [...prev, recipeToSave]
    })
    
    return true
  }

  const unsaveRecipe = (recipeId) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId))
  }

  const isRecipeSaved = (recipeId) => {
    return savedRecipes.some(r => r.id === recipeId)
  }

  const customizeRecipe = async (recipe, customization, user) => {
    try {
      // In a real implementation, this would call OpenAI API with customization request
      // For now, we'll simulate customization
      const customizedRecipe = {
        ...recipe,
        id: `recipe_${Date.now()}`,
        title: `${recipe.title} (Customized)`,
        description: `${recipe.description} - ${customization}`,
        customization: customization,
        originalRecipeId: recipe.id
      }
      
      return customizedRecipe
    } catch (error) {
      console.error('Failed to customize recipe:', error)
      throw error
    }
  }

  // Helper function to extract ingredients from natural language
  const extractIngredients = (text) => {
    const commonIngredients = [
      'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna',
      'rice', 'pasta', 'noodles', 'bread', 'flour',
      'tomato', 'tomatoes', 'onion', 'onions', 'garlic', 'ginger',
      'potato', 'potatoes', 'carrot', 'carrots', 'broccoli',
      'cheese', 'milk', 'cream', 'butter', 'egg', 'eggs',
      'oil', 'olive oil', 'salt', 'pepper', 'sugar',
      'basil', 'oregano', 'thyme', 'parsley', 'cilantro',
      'bell pepper', 'mushroom', 'mushrooms', 'spinach',
      'beans', 'lentils', 'quinoa', 'avocado'
    ]
    
    const foundIngredients = []
    const lowerText = text.toLowerCase()
    
    commonIngredients.forEach(ingredient => {
      if (lowerText.includes(ingredient)) {
        foundIngredients.push(ingredient)
      }
    })
    
    return foundIngredients
  }

  // Helper function to calculate recipe cost
  const calculateRecipeCost = (recipe) => {
    // Base cost calculation - in a real app this would be more sophisticated
    const basePrice = 0.20 // $0.20 base price
    const complexityMultiplier = recipe.ingredients?.length > 8 ? 1.5 : 1.0
    const timeMultiplier = (recipe.prepTime + recipe.cookTime) > 45 ? 1.3 : 1.0
    
    return Math.round(basePrice * complexityMultiplier * timeMultiplier * 100) / 100
  }

  const value = {
    // State
    messages,
    savedRecipes,
    currentIngredients,
    
    // Actions
    addMessage,
    clearMessages,
    generateRecipeFromIngredients,
    saveRecipe,
    unsaveRecipe,
    isRecipeSaved,
    customizeRecipe,
    
    // Utilities
    extractIngredients
  }

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  )
}
