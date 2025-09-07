import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useUser } from '../context/UserContext'

const UserProfileModal = ({ isOpen, onClose, onComplete, isFirstTime }) => {
  const { user, updateUser } = useUser()
  const [formData, setFormData] = useState({
    dietaryPreferences: [],
    allergies: [],
    calorieGoal: ''
  })
  const [newPreference, setNewPreference] = useState('')
  const [newAllergy, setNewAllergy] = useState('')

  const commonDietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'Mediterranean', 
    'Low-Carb', 'Low-Fat', 'Dairy-Free', 'Pescatarian'
  ]

  const commonAllergies = [
    'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish'
  ]

  useEffect(() => {
    if (user) {
      setFormData({
        dietaryPreferences: user.dietaryPreferences || [],
        allergies: user.allergies || [],
        calorieGoal: user.calorieGoal || ''
      })
    }
  }, [user])

  const handleSave = () => {
    updateUser({
      ...user,
      ...formData,
      calorieGoal: formData.calorieGoal ? parseInt(formData.calorieGoal) : null
    })
    onComplete()
  }

  const addPreference = (preference) => {
    if (!formData.dietaryPreferences.includes(preference)) {
      setFormData({
        ...formData,
        dietaryPreferences: [...formData.dietaryPreferences, preference]
      })
    }
  }

  const removePreference = (preference) => {
    setFormData({
      ...formData,
      dietaryPreferences: formData.dietaryPreferences.filter(p => p !== preference)
    })
  }

  const addAllergy = (allergy) => {
    if (!formData.allergies.includes(allergy)) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergy]
      })
    }
  }

  const removeAllergy = (allergy) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(a => a !== allergy)
    })
  }

  const addCustomPreference = () => {
    if (newPreference.trim() && !formData.dietaryPreferences.includes(newPreference.trim())) {
      addPreference(newPreference.trim())
      setNewPreference('')
    }
  }

  const addCustomAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      addAllergy(newAllergy.trim())
      setNewAllergy('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-text-primary">
            {isFirstTime ? 'Welcome to PantryChef AI!' : 'Profile Settings'}
          </h2>
          {!isFirstTime && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-4 space-y-6">
          {isFirstTime && (
            <p className="text-sm text-text-secondary">
              Let's set up your preferences so I can create perfect recipes for you!
            </p>
          )}

          {/* Dietary Preferences */}
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Dietary Preferences</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {commonDietaryOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => 
                    formData.dietaryPreferences.includes(option) 
                      ? removePreference(option)
                      : addPreference(option)
                  }
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    formData.dietaryPreferences.includes(option)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Custom preference input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                placeholder="Add custom preference..."
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyPress={(e) => e.key === 'Enter' && addCustomPreference()}
              />
              <button
                onClick={addCustomPreference}
                className="bg-primary text-white p-1 rounded hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Selected preferences */}
            {formData.dietaryPreferences.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-text-secondary mb-1">Selected:</p>
                <div className="flex flex-wrap gap-1">
                  {formData.dietaryPreferences.map((pref) => (
                    <span
                      key={pref}
                      className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {pref}
                      <button
                        onClick={() => removePreference(pref)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Allergies */}
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Allergies & Restrictions</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {commonAllergies.map((allergy) => (
                <button
                  key={allergy}
                  onClick={() => 
                    formData.allergies.includes(allergy) 
                      ? removeAllergy(allergy)
                      : addAllergy(allergy)
                  }
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    formData.allergies.includes(allergy)
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>

            {/* Custom allergy input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add custom allergy..."
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
              />
              <button
                onClick={addCustomAllergy}
                className="bg-primary text-white p-1 rounded hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Selected allergies */}
            {formData.allergies.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-text-secondary mb-1">Allergies:</p>
                <div className="flex flex-wrap gap-1">
                  {formData.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {allergy}
                      <button
                        onClick={() => removeAllergy(allergy)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Calorie Goal */}
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Daily Calorie Goal (Optional)</h3>
            <input
              type="number"
              value={formData.calorieGoal}
              onChange={(e) => setFormData({ ...formData, calorieGoal: e.target.value })}
              placeholder="e.g., 2000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-text-secondary mt-1">
              I'll suggest recipes that fit your calorie goals
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isFirstTime ? "Let's Start Cooking!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfileModal