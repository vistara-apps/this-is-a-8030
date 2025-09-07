# PantryChef AI 🧑‍🍳

**Your Personal AI Chef: Delicious Recipes from What You Have**

A Telegram Mini App that generates personalized recipes based on user-provided ingredients, dietary preferences, and calorie goals, leveraging AI.

![PantryChef AI](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=PantryChef+AI)

## 🚀 Features

### Core Features
- **Smart Ingredient Input**: Natural language chat interface for quickly listing pantry items
- **Granular Dietary Profiling**: Precise dietary restrictions and allergy management
- **Personalized Recipe Engine**: AI-powered recipe generation based on user inputs
- **Recipe Customization & Saving**: Tweak recipes and build a personal cookbook

### Technical Features
- **Telegram Mini App**: Seamless integration with Telegram
- **Web3 Payments**: On-chain payments using USDC on Base blockchain
- **AI Integration**: OpenAI/OpenRouter API for intelligent recipe generation
- **Real-time Chat**: Interactive chat interface for natural ingredient input
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Blockchain**: Base, Wagmi, RainbowKit
- **AI**: OpenAI API (via OpenRouter)
- **Backend**: Supabase (planned)
- **Payments**: x402-axios, Web3 wallets
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-8030.git
   cd this-is-a-8030
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_WALLETCONNECT_PROJECT_ID=9f4bd472c01ba49282b42e5e1874c2af
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗 Architecture

### Data Model

#### User Entity
```javascript
{
  user_id: "telegram_user_id",
  dietary_preferences: ["vegetarian", "gluten-free"],
  allergies: ["peanuts", "dairy"],
  calorie_goal: 2000,
  saved_recipes: ["recipe_id_1", "recipe_id_2"],
  onchain_wallet_address: "0x..."
}
```

#### Recipe Entity
```javascript
{
  recipe_id: "unique_recipe_id",
  title: "Recipe Name",
  description: "Brief description",
  ingredients_used: ["ingredient1", "ingredient2"],
  instructions: ["step1", "step2"],
  prep_time: 15,
  cook_time: 25,
  tags: ["tag1", "tag2"],
  saved_by_user_id: ["user1", "user2"]
}
```

#### Ingredient Entity
```javascript
{
  ingredient_id: "unique_ingredient_id",
  name: "ingredient_name",
  user_id: "owner_user_id"
}
```

### Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   OpenAI API    │    │   Supabase      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ ChatInterface│ │───▶│ │Recipe Gen   │ │    │ │User Data    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │PaymentModal │ │───▶│ │Customization│ │    │ │Recipe Store │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐                            ┌─────────────────┐
│   Web3 Wallet   │                            │   Ingredients   │
│                 │                            │                 │
│ ┌─────────────┐ │                            │ ┌─────────────┐ │
│ │USDC Payment │ │                            │ │User Pantry  │ │
│ └─────────────┘ │                            │ └─────────────┘ │
└─────────────────┘                            └─────────────────┘
```

## 🎯 User Flows

### 1. New User Onboarding
1. User initiates chat with the bot
2. Bot prompts user to set dietary preferences and allergies
3. User inputs details via inline buttons or /settings command
4. Bot confirms preferences and offers to start generating recipes

### 2. Recipe Generation & Payment
1. User lists available ingredients in chat
2. Bot acknowledges ingredients and asks for optional calorie goals
3. User confirms or provides calorie goal
4. Bot sends request to OpenAI API
5. Bot presents recipe preview
6. Bot prompts for payment ($0.20 USDC)
7. User approves payment via integrated wallet
8. Bot confirms payment and displays the full recipe

### 3. Saving a Recipe
1. User asks to save a generated recipe
2. Bot prompts for confirmation
3. User confirms
4. Bot adds recipe ID to user's saved recipes list

## 💰 Business Model

**Type**: Micro-transactions
**Pricing**: 
- Pay-per-recipe generation: $0.10 - $0.50 per recipe
- Daily/weekly subscription for unlimited generations

**Payment Methods**:
- USDC on Base blockchain
- Integrated Web3 wallet support
- Fallback to traditional payment methods

## 🎨 Design System

### Colors
```css
:root {
  --primary: hsl(240 70% 50%);
  --accent: hsl(180 60% 45%);
  --bg: hsl(220 15% 95%);
  --surface: hsl(0 0% 100%);
  --text-primary: hsl(220 15% 15%);
  --text-secondary: hsl(220 15% 40%);
}
```

### Components
- **ChatInput**: Message input with send button
- **ChatMessage**: User/bot message bubbles
- **RecipeCard**: Compact and detailed recipe display
- **IconButton**: Primary and secondary action buttons
- **Modal**: Dialog and confirmation modals

## 🔧 Configuration

### OpenAI Integration
The app supports both mock and real OpenAI API integration. To enable real API:

1. Set `USE_REAL_API = true` in `src/services/openaiService.js`
2. Add your OpenAI API key to `.env`
3. Configure the model and parameters as needed

### Supabase Integration
Currently using localStorage for demo. To enable Supabase:

1. Set up a Supabase project
2. Add your Supabase URL and anon key to `.env`
3. Update `src/services/supabaseService.js` to use real Supabase client

### Web3 Payments
Payments are integrated with Base blockchain:

- **Network**: Base
- **Token**: USDC
- **Wallet**: RainbowKit integration
- **Payment Service**: x402-axios

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment
```bash
docker build -t pantrychef-ai .
docker run -p 3000:3000 pantrychef-ai
```

### Environment Variables for Production
```env
VITE_OPENAI_API_KEY=prod_openai_key
VITE_SUPABASE_URL=prod_supabase_url
VITE_SUPABASE_ANON_KEY=prod_supabase_key
VITE_PAYMENT_API_URL=https://payments.vistara.dev
```

## 📱 Telegram Mini App Setup

1. **Create a Telegram Bot**
   - Message @BotFather on Telegram
   - Use `/newbot` command
   - Get your bot token

2. **Configure Mini App**
   - Use `/newapp` command with @BotFather
   - Set your web app URL
   - Configure app settings

3. **Deploy and Test**
   - Deploy your app to a public URL
   - Test the integration in Telegram

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Testing
```bash
npm run test:e2e
```

## 📊 Analytics & Monitoring

### Key Metrics
- Recipe generation requests
- Payment conversion rate
- User retention
- Popular ingredients/recipes
- Error rates

### Monitoring
- API response times
- Payment success rates
- User engagement metrics
- System performance

## 🔒 Security

### Data Protection
- User data encrypted at rest
- Secure API key management
- Input validation and sanitization
- Rate limiting on API calls

### Web3 Security
- Secure wallet integration
- Transaction verification
- Smart contract auditing
- Private key protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI recipe generation
- Base blockchain for payment infrastructure
- Telegram for Mini App platform
- Supabase for backend services
- The open-source community

## 📞 Support

For support, email support@pantrychef.ai or join our Telegram community.

---

**Made with ❤️ by the PantryChef AI Team**
