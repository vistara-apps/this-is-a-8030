import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Settings, ChefHat } from 'lucide-react'

const Header = ({ onProfileClick }) => {
  return (
    <header className="bg-primary text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ChefHat className="w-6 h-6" />
        <div>
          <h1 className="text-lg font-bold">PantryChef AI</h1>
          <p className="text-xs opacity-90">Your Personal AI Chef</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onProfileClick}
          className="p-2 hover:bg-white/20 rounded-md transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="scale-75">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </header>
  )
}

export default Header