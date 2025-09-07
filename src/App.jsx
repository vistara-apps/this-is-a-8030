import React, { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Header from './components/Header'
import ChatInterface from './components/ChatInterface'
import UserProfileModal from './components/UserProfileModal'
import { UserProvider } from './context/UserContext'
import { RecipeProvider } from './context/RecipeContext'

function App() {
  const [showProfile, setShowProfile] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('pantryChef_hasVisited')
    if (hasVisited) {
      setIsFirstTime(false)
    }
  }, [])

  const handleProfileComplete = () => {
    setIsFirstTime(false)
    setShowProfile(false)
    localStorage.setItem('pantryChef_hasVisited', 'true')
  }

  return (
    <UserProvider>
      <RecipeProvider>
        <div className="min-h-screen bg-bg">
          <div className="w-full max-w-lg mx-auto bg-surface min-h-screen shadow-lg">
            <Header onProfileClick={() => setShowProfile(true)} />
            <ChatInterface isFirstTime={isFirstTime} />
            
            {(showProfile || isFirstTime) && (
              <UserProfileModal
                isOpen={showProfile || isFirstTime}
                onClose={() => setShowProfile(false)}
                onComplete={handleProfileComplete}
                isFirstTime={isFirstTime}
              />
            )}
          </div>
        </div>
      </RecipeProvider>
    </UserProvider>
  )
}

export default App