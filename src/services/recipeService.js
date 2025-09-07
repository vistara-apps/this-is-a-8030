// Mock recipe generation service
// In production, this would connect to OpenAI API

const sampleRecipes = [
  {
    id: 'recipe_1',
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
    tags: ['One-Bowl', 'Comfort Food', 'Easy', 'Family-Friendly']
  },
  {
    id: 'recipe_2',
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
    tags: ['Mediterranean', 'Vegetarian', 'Fresh', 'Healthy']
  },
  {
    id: 'recipe_3',
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
    tags: ['Spicy', 'Quick', 'Protein-Rich', 'Satisfying']
  }
];

export const generateRecipe = async (ingredients, user) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple logic to pick a recipe based on ingredients
  const lowerIngredients = ingredients.toLowerCase();
  
  let selectedRecipe;
  
  if (lowerIngredients.includes('chicken') && lowerIngredients.includes('rice')) {
    selectedRecipe = sampleRecipes[0];
  } else if (lowerIngredients.includes('pasta') || lowerIngredients.includes('tomato')) {
    selectedRecipe = sampleRecipes[1];
  } else if (lowerIngredients.includes('beef') || lowerIngredients.includes('potato')) {
    selectedRecipe = sampleRecipes[2];
  } else {
    // Random recipe if no match
    selectedRecipe = sampleRecipes[Math.floor(Math.random() * sampleRecipes.length)];
  }
  
  // Customize based on user preferences
  let customizedRecipe = { ...selectedRecipe };
  
  if (user.dietaryPreferences?.includes('Vegetarian') || user.dietaryPreferences?.includes('Vegan')) {
    // Switch to vegetarian recipe
    customizedRecipe = { ...sampleRecipes[1] };
    customizedRecipe.title = 'Garden Vegetable Pasta';
    customizedRecipe.description = 'Fresh seasonal vegetables tossed with pasta in a light herb sauce';
  }
  
  if (user.allergies?.includes('Dairy')) {
    // Remove dairy ingredients
    customizedRecipe.ingredients = customizedRecipe.ingredients.filter(
      ingredient => !ingredient.toLowerCase().includes('cream') && 
                   !ingredient.toLowerCase().includes('cheese') &&
                   !ingredient.toLowerCase().includes('milk')
    );
  }
  
  if (user.allergies?.includes('Gluten')) {
    // Suggest gluten-free alternatives
    customizedRecipe.instructions = [
      'Note: Use gluten-free pasta or rice noodles for this recipe.',
      ...customizedRecipe.instructions
    ];
  }
  
  return customizedRecipe;
};

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