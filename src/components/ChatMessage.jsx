import React from 'react'
import { Bot, User } from 'lucide-react'

const ChatMessage = ({ message }) => {
  const isUser = message.type === 'user'
  const isBot = message.type === 'bot'
  const isInfo = message.type === 'info'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-xs sm:max-w-sm md:max-w-md ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        {!isUser && (
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isBot ? 'bg-primary text-white' : 'bg-gray-300'
          }`}>
            {isBot ? <Bot className="w-4 h-4" /> : <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
        )}

        {/* Message bubble */}
        <div className={`rounded-lg px-3 py-2 ${
          isUser 
            ? 'bg-primary text-white' 
            : isInfo 
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="text-sm leading-normal whitespace-pre-wrap">{message.content}</p>
          <p className={`text-xs mt-1 opacity-70 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* User avatar */}
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage