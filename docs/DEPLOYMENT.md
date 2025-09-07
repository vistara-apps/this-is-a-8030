# PantryChef AI - Deployment Guide

## Overview

This guide covers deploying PantryChef AI to production environments, including setup for Telegram Mini App integration, Web3 payments, and API services.

## Prerequisites

- Node.js 18+ and npm
- Docker (optional)
- Telegram Bot Token
- OpenAI API Key (or OpenRouter)
- Supabase Project
- Base blockchain wallet for payments
- Domain name with SSL certificate

## Environment Setup

### 1. Environment Variables

Create a `.env` file with the following variables:

```bash
# Application
VITE_APP_NAME=PantryChef AI
VITE_APP_DESCRIPTION=Your Personal AI Chef: Delicious Recipes from What You Have
VITE_APP_URL=https://your-domain.com

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_BASE_URL=https://openrouter.ai/api/v1
VITE_OPENAI_MODEL=google/gemini-2.0-flash-001

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Wallet Connect Configuration
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Payment Configuration
VITE_PAYMENT_API_URL=https://payments.vistara.dev
VITE_BASE_RPC_URL=https://mainnet.base.org

# Telegram Configuration
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_BOT_USERNAME=your_bot_username

# Analytics (Optional)
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

### 2. Supabase Database Setup

#### Create Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  dietary_preferences JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  calorie_goal INTEGER,
  saved_recipes JSONB DEFAULT '[]',
  onchain_wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE recipes (
  recipe_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients_used JSONB DEFAULT '[]',
  instructions JSONB DEFAULT '[]',
  prep_time INTEGER,
  cook_time INTEGER,
  tags JSONB DEFAULT '[]',
  saved_by_user_id JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE ingredients (
  ingredient_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT REFERENCES users(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_recipes_recipe_id ON recipes(recipe_id);
CREATE INDEX idx_recipes_saved_by_user ON recipes USING GIN(saved_by_user_id);
CREATE INDEX idx_ingredients_user_id ON ingredients(user_id);
```

#### Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'user_id');

-- Recipes policies
CREATE POLICY "Anyone can view recipes" ON recipes FOR SELECT TO authenticated;
CREATE POLICY "Anyone can create recipes" ON recipes FOR INSERT TO authenticated;
CREATE POLICY "Users can update recipes they saved" ON recipes
  FOR UPDATE USING (saved_by_user_id ? (current_setting('request.jwt.claims')::json->>'user_id'));

-- Ingredients policies
CREATE POLICY "Users can view own ingredients" ON ingredients
  FOR SELECT USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');

CREATE POLICY "Users can manage own ingredients" ON ingredients
  FOR ALL USING (user_id = current_setting('request.jwt.claims')::json->>'user_id');
```

## Deployment Options

### Option 1: Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all environment variables from your `.env` file

5. **Custom Domain**
   - Go to Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

### Option 2: Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Configure Environment Variables**
   - Go to Netlify Dashboard
   - Site Settings > Environment Variables
   - Add all variables

### Option 3: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t pantrychef-ai .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name pantrychef-ai \
     -p 3000:3000 \
     --env-file .env \
     pantrychef-ai
   ```

3. **Docker Compose** (with nginx)
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       environment:
         - NODE_ENV=production
       env_file:
         - .env
       expose:
         - "3000"
     
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/nginx/ssl
       depends_on:
         - app
   ```

### Option 4: AWS Deployment

1. **S3 + CloudFront**
   ```bash
   # Build
   npm run build
   
   # Upload to S3
   aws s3 sync dist/ s3://your-bucket-name --delete
   
   # Invalidate CloudFront
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

2. **Amplify Deployment**
   ```bash
   # Install Amplify CLI
   npm install -g @aws-amplify/cli
   
   # Initialize
   amplify init
   
   # Add hosting
   amplify add hosting
   
   # Deploy
   amplify publish
   ```

## Telegram Bot Setup

### 1. Create Telegram Bot

1. **Message @BotFather**
   ```
   /newbot
   ```

2. **Set Bot Name and Username**
   ```
   PantryChef AI
   pantrychef_ai_bot
   ```

3. **Get Bot Token**
   Save the token to your environment variables.

### 2. Create Mini App

1. **Create Web App**
   ```
   /newapp
   ```

2. **Configure App**
   - **App Name**: PantryChef AI
   - **Description**: Your Personal AI Chef
   - **Photo**: Upload app icon
   - **Web App URL**: https://your-domain.com

3. **Set Menu Button**
   ```
   /setmenubutton
   ```
   - Select your bot
   - Set button text: "🧑‍🍳 Start Cooking"
   - Set Web App URL: https://your-domain.com

### 3. Configure Bot Settings

```
/setdescription
Your Personal AI Chef: Generate delicious recipes from ingredients you have at home! 🧑‍🍳

/setabouttext
PantryChef AI helps you create amazing recipes using ingredients you already have. Just tell me what's in your pantry, and I'll generate personalized recipes tailored to your dietary preferences and restrictions.

/setuserpic
[Upload bot profile picture]

/setcommands
start - Start using PantryChef AI
help - Get help and instructions
settings - Configure your preferences
recipes - View saved recipes
```

## SSL Certificate Setup

### Let's Encrypt (Free)

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare (Recommended)

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable "Always Use HTTPS"
4. Set SSL/TLS mode to "Full (strict)"

## Performance Optimization

### 1. Build Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          web3: ['wagmi', '@rainbow-me/rainbowkit'],
          ui: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. CDN Configuration

```javascript
// For static assets
const CDN_URL = 'https://cdn.your-domain.com'

// In your build process
const replaceAssetUrls = (html) => {
  return html.replace(/\/assets\//g, `${CDN_URL}/assets/`)
}
```

### 3. Caching Headers

```nginx
# nginx.conf
location /assets/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location / {
  expires 1h;
  add_header Cache-Control "public";
}
```

## Monitoring and Analytics

### 1. Error Tracking (Sentry)

```javascript
// main.jsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})
```

### 2. Analytics (Google Analytics)

```javascript
// analytics.js
import { gtag } from 'ga-gtag'

gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
  page_title: 'PantryChef AI',
  page_location: window.location.href
})

export const trackEvent = (action, category, label) => {
  gtag('event', action, {
    event_category: category,
    event_label: label
  })
}
```

### 3. Performance Monitoring

```javascript
// performance.js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'navigation') {
      console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart)
    }
  }
})

observer.observe({ entryTypes: ['navigation'] })
```

## Security Checklist

### 1. Environment Security
- [ ] All API keys in environment variables
- [ ] No sensitive data in client-side code
- [ ] HTTPS enabled everywhere
- [ ] CORS properly configured

### 2. API Security
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] XSS protection

### 3. Web3 Security
- [ ] Wallet connection validation
- [ ] Transaction verification
- [ ] Smart contract auditing
- [ ] Private key protection

## Backup and Recovery

### 1. Database Backup

```bash
# Supabase backup
pg_dump "postgresql://user:pass@host:port/db" > backup.sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump "postgresql://user:pass@host:port/db" > "backup_$DATE.sql"
aws s3 cp "backup_$DATE.sql" s3://your-backup-bucket/
```

### 2. Code Backup

```bash
# Git backup
git remote add backup https://github.com/your-org/pantrychef-backup.git
git push backup main

# Automated deployment backup
git tag "deploy-$(date +%Y%m%d-%H%M%S)"
git push origin --tags
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf node_modules package-lock.json
   npm install
   
   # Check Node version
   node --version  # Should be 18+
   ```

2. **API Connection Issues**
   ```bash
   # Test API endpoints
   curl -X POST https://openrouter.ai/api/v1/chat/completions \
     -H "Authorization: Bearer $VITE_OPENAI_API_KEY" \
     -H "Content-Type: application/json"
   ```

3. **Telegram Integration Issues**
   - Verify bot token
   - Check webhook URL
   - Ensure HTTPS is working
   - Test with Telegram Bot API

4. **Payment Issues**
   - Verify wallet connection
   - Check Base network status
   - Validate USDC contract address
   - Test with small amounts first

### Logs and Debugging

```bash
# Application logs
docker logs pantrychef-ai

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u pantrychef-ai -f
```

## Maintenance

### Regular Tasks

1. **Weekly**
   - Check error rates
   - Review performance metrics
   - Update dependencies
   - Backup database

2. **Monthly**
   - Security audit
   - Cost optimization review
   - User feedback analysis
   - Feature usage analytics

3. **Quarterly**
   - Major dependency updates
   - Security penetration testing
   - Performance optimization
   - Business metrics review

### Update Process

```bash
# 1. Test in staging
git checkout staging
git pull origin main
npm install
npm run build
npm run test

# 2. Deploy to production
git checkout main
git pull origin main
npm install
npm run build

# 3. Deploy
vercel --prod
# or
docker build -t pantrychef-ai:latest .
docker stop pantrychef-ai
docker rm pantrychef-ai
docker run -d --name pantrychef-ai pantrychef-ai:latest
```

## Support and Documentation

- **Documentation**: https://docs.pantrychef.ai
- **Status Page**: https://status.pantrychef.ai
- **Support Email**: support@pantrychef.ai
- **GitHub Issues**: https://github.com/your-org/pantrychef-ai/issues

---

**Deployment completed successfully! 🚀**
