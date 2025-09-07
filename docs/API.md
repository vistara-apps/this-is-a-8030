# PantryChef AI - API Documentation

## Overview

PantryChef AI integrates with multiple APIs to provide a comprehensive recipe generation experience. This document outlines all API integrations and their usage.

## API Integrations

### 1. OpenAI API (via OpenRouter)

**Purpose**: Generate personalized recipes based on user inputs
**Base URL**: `https://openrouter.ai/api/v1`
**Model**: `google/gemini-2.0-flash-001`

#### Authentication
```javascript
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})
```

#### Recipe Generation Endpoint
```javascript
POST /chat/completions
```

**Request Body**:
```json
{
  "model": "google/gemini-2.0-flash-001",
  "messages": [
    {
      "role": "user",
      "content": "Create a delicious recipe using these ingredients: chicken, rice, broccoli..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response Format**:
```json
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
```

#### Rate Limiting
- 1 request per second
- Automatic retry with exponential backoff
- Fallback to mock recipes on failure

### 2. Supabase API

**Purpose**: Backend-as-a-Service for user data storage
**Base URL**: `https://your-project.supabase.co/rest/v1`

#### Authentication
```javascript
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)
```

#### User Management

**Create User**:
```javascript
POST /users
```
```json
{
  "user_id": "telegram_user_id",
  "dietary_preferences": ["vegetarian"],
  "allergies": ["nuts"],
  "calorie_goal": 2000
}
```

**Get User**:
```javascript
GET /users?user_id=eq.{user_id}
```

**Update User**:
```javascript
PATCH /users?user_id=eq.{user_id}
```

#### Recipe Management

**Create Recipe**:
```javascript
POST /recipes
```
```json
{
  "recipe_id": "unique_id",
  "title": "Recipe Name",
  "description": "Description",
  "ingredients_used": ["ingredient1"],
  "instructions": ["step1"],
  "prep_time": 15,
  "cook_time": 25,
  "tags": ["tag1"]
}
```

**Get User Recipes**:
```javascript
GET /recipes?saved_by_user_id=cs.{user_id}
```

**Save Recipe for User**:
```javascript
PATCH /recipes?recipe_id=eq.{recipe_id}
```
```json
{
  "saved_by_user_id": ["user1", "user2", "new_user"]
}
```

#### Ingredient Management

**Create Ingredient**:
```javascript
POST /ingredients
```
```json
{
  "ingredient_id": "unique_id",
  "name": "ingredient_name",
  "user_id": "owner_id"
}
```

**Get User Ingredients**:
```javascript
GET /ingredients?user_id=eq.{user_id}
```

### 3. Payment API (x402-axios)

**Purpose**: Handle on-chain payments for recipe generation
**Base URL**: `https://payments.vistara.dev`

#### Authentication
Uses Web3 wallet signatures for authentication.

#### Create Payment Session
```javascript
POST /api/payment
```
```json
{
  "amount": "$0.25"
}
```

**Response**:
```json
{
  "session_id": "payment_session_id",
  "payment_address": "0x...",
  "amount_wei": "250000000000000000",
  "expires_at": "2024-01-01T12:00:00Z"
}
```

#### Payment Verification
The payment is verified through the `X-PAYMENT` header in the response.

### 4. Base RPC

**Purpose**: Direct blockchain interaction for transaction monitoring
**Network**: Base Mainnet
**RPC URL**: `https://mainnet.base.org`

#### Common Operations

**Get Transaction Status**:
```javascript
POST /
```
```json
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionReceipt",
  "params": ["0x...transaction_hash"],
  "id": 1
}
```

**Get Account Balance**:
```javascript
POST /
```
```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": ["0x...address", "latest"],
  "id": 1
}
```

## Error Handling

### OpenAI API Errors
```javascript
try {
  const recipe = await generateRecipe(ingredients, preferences)
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded - wait and retry
    await new Promise(resolve => setTimeout(resolve, 1000))
    return await generateRecipe(ingredients, preferences)
  } else if (error.status >= 500) {
    // Server error - fallback to mock
    return await generateMockRecipe(ingredients, preferences)
  } else {
    // Client error - show user-friendly message
    throw new Error('Failed to generate recipe. Please try again.')
  }
}
```

### Supabase Errors
```javascript
try {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
  
  if (error) throw error
  return data
} catch (error) {
  console.error('Database error:', error)
  // Fallback to localStorage
  localStorage.setItem('user_data', JSON.stringify(userData))
}
```

### Payment Errors
```javascript
try {
  const payment = await createPaymentSession()
} catch (error) {
  if (error.code === 'WALLET_NOT_CONNECTED') {
    // Prompt user to connect wallet
    showWalletConnectionModal()
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    // Show insufficient funds message
    showInsufficientFundsMessage()
  } else {
    // Generic payment error
    showPaymentErrorMessage()
  }
}
```

## Rate Limiting

### OpenAI API
- **Limit**: 1 request per second
- **Implementation**: Queue-based with delays
- **Fallback**: Mock recipe generation

### Supabase
- **Limit**: 100 requests per minute (free tier)
- **Implementation**: Request batching
- **Fallback**: localStorage caching

### Payment API
- **Limit**: 10 requests per minute per wallet
- **Implementation**: Exponential backoff
- **Fallback**: Retry mechanism

## Caching Strategy

### Recipe Caching
```javascript
// Cache generated recipes for 1 hour
const cacheKey = `recipe_${ingredientsHash}_${preferencesHash}`
const cachedRecipe = localStorage.getItem(cacheKey)

if (cachedRecipe && !isExpired(cachedRecipe.timestamp)) {
  return JSON.parse(cachedRecipe.data)
}

// Generate new recipe and cache
const recipe = await generateRecipe(ingredients, preferences)
localStorage.setItem(cacheKey, JSON.stringify({
  data: recipe,
  timestamp: Date.now()
}))
```

### User Data Caching
```javascript
// Cache user preferences locally
const userCache = {
  data: userData,
  lastSync: Date.now(),
  dirty: false
}

// Sync with server every 5 minutes
setInterval(async () => {
  if (userCache.dirty) {
    await syncUserData(userCache.data)
    userCache.dirty = false
    userCache.lastSync = Date.now()
  }
}, 5 * 60 * 1000)
```

## Security Considerations

### API Key Management
- Store API keys in environment variables
- Never expose keys in client-side code
- Use server-side proxy for sensitive operations
- Rotate keys regularly

### Input Validation
```javascript
const validateIngredients = (ingredients) => {
  if (!ingredients || typeof ingredients !== 'string') {
    throw new Error('Invalid ingredients input')
  }
  
  if (ingredients.length > 1000) {
    throw new Error('Ingredients list too long')
  }
  
  // Sanitize input
  return ingredients.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}
```

### Rate Limiting Protection
```javascript
const rateLimiter = new Map()

const checkRateLimit = (userId, endpoint) => {
  const key = `${userId}_${endpoint}`
  const now = Date.now()
  const windowStart = now - (60 * 1000) // 1 minute window
  
  const requests = rateLimiter.get(key) || []
  const recentRequests = requests.filter(time => time > windowStart)
  
  if (recentRequests.length >= 10) {
    throw new Error('Rate limit exceeded')
  }
  
  recentRequests.push(now)
  rateLimiter.set(key, recentRequests)
}
```

## Monitoring and Analytics

### API Performance Metrics
```javascript
const trackAPICall = (endpoint, duration, success) => {
  analytics.track('api_call', {
    endpoint,
    duration,
    success,
    timestamp: Date.now()
  })
}
```

### Error Tracking
```javascript
const trackError = (error, context) => {
  console.error('API Error:', error)
  
  analytics.track('api_error', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: Date.now()
  })
}
```

### Usage Analytics
```javascript
const trackRecipeGeneration = (ingredients, preferences, success) => {
  analytics.track('recipe_generated', {
    ingredient_count: ingredients.split(',').length,
    has_dietary_preferences: preferences.dietaryPreferences?.length > 0,
    has_allergies: preferences.allergies?.length > 0,
    has_calorie_goal: !!preferences.calorieGoal,
    success,
    timestamp: Date.now()
  })
}
```

## Testing

### API Mocking
```javascript
// Mock OpenAI API for testing
const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify(mockRecipe)
          }
        }]
      })
    }
  }
}
```

### Integration Tests
```javascript
describe('Recipe Generation API', () => {
  test('should generate recipe with valid ingredients', async () => {
    const ingredients = 'chicken, rice, broccoli'
    const preferences = { dietaryPreferences: ['gluten-free'] }
    
    const recipe = await generateRecipe(ingredients, preferences)
    
    expect(recipe).toHaveProperty('title')
    expect(recipe).toHaveProperty('ingredients')
    expect(recipe).toHaveProperty('instructions')
    expect(recipe.title).not.toContain('gluten')
  })
})
```

## Deployment Configuration

### Environment Variables
```bash
# Production
VITE_OPENAI_API_KEY=sk-...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_PAYMENT_API_URL=https://payments.vistara.dev

# Development
VITE_OPENAI_API_KEY=sk-dev-...
VITE_SUPABASE_URL=https://xxx-dev.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_PAYMENT_API_URL=https://payments-dev.vistara.dev
```

### API Proxy Configuration
```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api/openai': {
        target: 'https://openrouter.ai/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, '')
      }
    }
  }
})
```
