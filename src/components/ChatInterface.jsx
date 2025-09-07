import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import ChatMessage from './ChatMessage'
import RecipeCard from './RecipeCard'
import PaymentModal from './PaymentModal'
import { useUser } from '../context/UserContext'
import { useRecipe } from '../context/RecipeContext'
import { generateRecipe } from '../services/recipeService'

const ChatInterface = ({ isFirstTime }) => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [pendingRecipe, setPendingRecipe] = useState(null)
  const messagesEndRef = useRef(null)
  
  const { user } = useUser()
  const { messages, addMessage, generateRecipeFromIngredients } = useRecipe()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isFirstTime && messages.length === 0) {
      // Welcome message for returning users
      addMessage({
        type: 'bot',
        content: `Welcome back! 👋 I'm your AI chef. Tell me what ingredients you have in your pantry, and I'll create delicious recipes for you!`,
        timestamp: new Date()
      })
    }
  }, [isFirstTime, messages.length, addMessage])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage('')

    // Add user message
    addMessage({
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    })

    setIsLoading(true)

    try {
      // Check if message contains ingredients
      if (containsIngredients(userMessage)) {
        // Show bot thinking
        addMessage({
          type: 'bot',
          content: 'Let me analyze your ingredients and create a perfect recipe for you! 🧑‍🍳',
          timestamp: new Date()
        })

        // Generate recipe preview
        const recipe = await generateRecipeFromIngredients(userMessage, user)
        
        // Show payment prompt
        setPendingRecipe(recipe)
        setShowPayment(true)
      } else {
        // General chat response
        const response = generateChatResponse(userMessage, user)
        addMessage({
          type: 'bot',
          content: response,
          timestamp: new Date()
        })
      }
    } catch (error) {
      addMessage({
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again! 😅',
        timestamp: new Date()
      })
    }

    setIsLoading(false)
  }

  const handlePaymentSuccess = () => {
    if (pendingRecipe) {
      addMessage({
        type: 'recipe',
        content: pendingRecipe,
        timestamp: new Date()
      })
      setPendingRecipe(null)
    }
    setShowPayment(false)
  }

  const containsIngredients = (text) => {
    const ingredientKeywords = ['have', 'got', 'ingredients', 'chicken', 'beef', 'rice', 'pasta', 'tomato', 'onion', 'garlic', 'potato', 'bread', 'cheese', 'milk', 'egg', 'flour', 'sugar', 'salt', 'pepper']
    return ingredientKeywords.some(keyword => text.toLowerCase().includes(keyword))
  }

  const generateChatResponse = (message, user) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! 👋 I'm your personal AI chef. Tell me what ingredients you have, and I'll create amazing recipes tailored to your preferences!`
    }
    
    if (lowerMessage.includes('help')) {
      return `I can help you create recipes! Just tell me:
• What ingredients you have available
• Any dietary preferences or restrictions
• Calorie goals (optional)

For example: "I have chicken, rice, and broccoli" or "I want a vegetarian meal with pasta"`
    }
    
    if (lowerMessage.includes('dietary') || lowerMessage.includes('allerg')) {
      return `You can update your dietary preferences anytime by clicking the settings icon in the header. I'll always consider your restrictions: ${user.dietaryPreferences?.join(', ') || 'None set'}`
    }
    
    return `I'd love to help you cook! Tell me what ingredients you have available, and I'll create a personalized recipe just for you! 🍳`
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chat-scrollbar">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === 'recipe' ? (
              <RecipeCard recipe={msg.content} variant="detailed" />
            ) : (
              <ChatMessage message={msg} />
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cooking up something delicious...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-surface p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me what ingredients you have..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && pendingRecipe && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          recipe={pendingRecipe}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

export default ChatInterface