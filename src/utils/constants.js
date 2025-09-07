// Application constants and configuration

export const APP_CONFIG = {
  name: 'PantryChef AI',
  tagline: 'Your Personal AI Chef: Delicious Recipes from What You Have',
  version: '1.0.0',
  description: 'A Telegram Mini App that generates personalized recipes based on user-provided ingredients, dietary preferences, and calorie goals, leveraging AI.',
}

export const API_ENDPOINTS = {
  openai: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'google/gemini-2.0-flash-001',
    completions: '/chat/completions'
  },
  supabase: {
    users: '/users',
    recipes: '/recipes',
    ingredients: '/ingredients'
  },
  payments: {
    baseUrl: 'https://payments.vistara.dev',
    create: '/api/payment'
  }
}

export const DIETARY_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low Carb',
  'Low Fat',
  'High Protein',
  'Gluten-Free',
  'Dairy-Free'
]

export const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Dairy',
  'Eggs',
  'Soy',
  'Wheat/Gluten',
  'Fish',
  'Shellfish',
  'Sesame',
  'Sulfites'
]

export const RECIPE_TAGS = [
  'Quick',
  'Easy',
  'Healthy',
  'Comfort Food',
  'One-Bowl',
  'High-Protein',
  'Low-Carb',
  'Spicy',
  'Sweet',
  'Savory',
  'Mediterranean',
  'Asian',
  'Mexican',
  'Italian',
  'American',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
  'Appetizer',
  'Main Course',
  'Side Dish',
  'Soup',
  'Salad',
  'Pasta',
  'Rice',
  'Meat',
  'Seafood',
  'Vegetarian',
  'Vegan'
]

export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
}

export const COOKING_TIMES = {
  QUICK: { min: 0, max: 30, label: 'Quick (Under 30 min)' },
  MEDIUM: { min: 30, max: 60, label: 'Medium (30-60 min)' },
  LONG: { min: 60, max: 999, label: 'Long (Over 1 hour)' }
}

export const PAYMENT_CONFIG = {
  currency: 'USDC',
  network: 'Base',
  prices: {
    recipe: 0.25,
    customization: 0.10,
    weeklyPass: 2.99,
    monthlyPass: 9.99
  }
}

export const STORAGE_KEYS = {
  user: 'pantryChef_user',
  messages: 'pantryChef_messages',
  savedRecipes: 'pantryChef_savedRecipes',
  hasVisited: 'pantryChef_hasVisited',
  preferences: 'pantryChef_preferences'
}

export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  RECIPE: 'recipe',
  INFO: 'info',
  ERROR: 'error'
}

export const RECIPE_GENERATION_LIMITS = {
  maxIngredients: 20,
  maxIngredientsLength: 1000,
  maxCustomizationLength: 500,
  rateLimitDelay: 1000, // 1 second between requests
  maxRetries: 3
}

export const UI_CONSTANTS = {
  maxChatMessages: 100,
  messageScrollDelay: 100,
  typingIndicatorDelay: 1500,
  paymentModalTimeout: 300000, // 5 minutes
  toastDuration: 3000
}

export const VALIDATION_RULES = {
  ingredients: {
    minLength: 3,
    maxLength: 1000,
    required: true
  },
  calorieGoal: {
    min: 500,
    max: 5000,
    required: false
  },
  customization: {
    minLength: 5,
    maxLength: 500,
    required: true
  }
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  API_ERROR: 'Service temporarily unavailable. Please try again later.',
  PAYMENT_ERROR: 'Payment failed. Please try again or contact support.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
}

export const SUCCESS_MESSAGES = {
  RECIPE_GENERATED: 'Recipe generated successfully! 🎉',
  RECIPE_SAVED: 'Recipe saved to your collection! ⭐',
  RECIPE_CUSTOMIZED: 'Recipe customized successfully! ✨',
  PAYMENT_SUCCESS: 'Payment successful! 💳',
  PREFERENCES_UPDATED: 'Preferences updated successfully! ⚙️'
}

export const PLACEHOLDER_TEXTS = {
  INGREDIENTS_INPUT: 'Tell me what ingredients you have...',
  CUSTOMIZATION_INPUT: 'How would you like to customize this recipe?',
  CALORIE_GOAL: 'Enter your daily calorie goal (optional)',
  SEARCH_RECIPES: 'Search your saved recipes...'
}

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px'
}

export const COLORS = {
  primary: 'hsl(240 70% 50%)',
  accent: 'hsl(180 60% 45%)',
  bg: 'hsl(220 15% 95%)',
  surface: 'hsl(0 0% 100%)',
  textPrimary: 'hsl(220 15% 15%)',
  textSecondary: 'hsl(220 15% 40%)',
  success: 'hsl(142 76% 36%)',
  warning: 'hsl(38 92% 50%)',
  error: 'hsl(0 84% 60%)',
  info: 'hsl(217 91% 60%)'
}

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  WALLET_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  TELEGRAM_USERNAME: /^@[a-zA-Z0-9_]{5,32}$/,
  INGREDIENT_NAME: /^[a-zA-Z0-9\s\-',\.]{2,50}$/
}

export const FEATURE_FLAGS = {
  REAL_OPENAI_API: false,
  REAL_SUPABASE: false,
  WEB3_PAYMENTS: true,
  ANALYTICS: true,
  ERROR_TRACKING: true,
  PERFORMANCE_MONITORING: true
}

export const TELEGRAM_CONFIG = {
  botUsername: '@pantrychef_ai_bot',
  webAppUrl: 'https://pantrychef.ai',
  supportUrl: 'https://t.me/pantrychef_support',
  channelUrl: 'https://t.me/pantrychef_updates'
}

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/pantrychef_ai',
  github: 'https://github.com/vistara-apps/pantrychef-ai',
  discord: 'https://discord.gg/pantrychef',
  website: 'https://pantrychef.ai'
}

export const NUTRITION_LABELS = {
  calories: 'Calories',
  protein: 'Protein (g)',
  carbs: 'Carbs (g)',
  fat: 'Fat (g)',
  fiber: 'Fiber (g)',
  sugar: 'Sugar (g)',
  sodium: 'Sodium (mg)'
}

export const MEASUREMENT_UNITS = {
  VOLUME: ['tsp', 'tbsp', 'cup', 'ml', 'l', 'fl oz', 'pint', 'quart', 'gallon'],
  WEIGHT: ['g', 'kg', 'oz', 'lb', 'mg'],
  LENGTH: ['inch', 'cm', 'mm'],
  TEMPERATURE: ['°F', '°C'],
  COUNT: ['piece', 'slice', 'clove', 'bunch', 'head', 'can', 'package']
}

export const COOKING_METHODS = [
  'Bake',
  'Boil',
  'Broil',
  'Fry',
  'Grill',
  'Roast',
  'Sauté',
  'Steam',
  'Stir-fry',
  'Simmer',
  'Braise',
  'Poach',
  'Blanch',
  'Marinate',
  'Season'
]

export const KITCHEN_EQUIPMENT = [
  'Oven',
  'Stovetop',
  'Microwave',
  'Air Fryer',
  'Slow Cooker',
  'Pressure Cooker',
  'Blender',
  'Food Processor',
  'Stand Mixer',
  'Grill',
  'Toaster',
  'Rice Cooker'
]

// Export default configuration object
export default {
  APP_CONFIG,
  API_ENDPOINTS,
  DIETARY_PREFERENCES,
  COMMON_ALLERGIES,
  RECIPE_TAGS,
  DIFFICULTY_LEVELS,
  COOKING_TIMES,
  PAYMENT_CONFIG,
  STORAGE_KEYS,
  MESSAGE_TYPES,
  RECIPE_GENERATION_LIMITS,
  UI_CONSTANTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PLACEHOLDER_TEXTS,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  COLORS,
  REGEX_PATTERNS,
  FEATURE_FLAGS,
  TELEGRAM_CONFIG,
  SOCIAL_LINKS,
  NUTRITION_LABELS,
  MEASUREMENT_UNITS,
  COOKING_METHODS,
  KITCHEN_EQUIPMENT
}
