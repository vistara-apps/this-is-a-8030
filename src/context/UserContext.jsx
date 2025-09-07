import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: 'demo_user_123',
    dietaryPreferences: [],
    allergies: [],
    calorieGoal: null,
    savedRecipes: [],
    onchainWalletAddress: null
  })

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('pantryChef_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
      }
    }
  }, [])

  // Save user data to localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem('pantryChef_user', JSON.stringify(user))
  }, [user])

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    updateUser,
    setUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}