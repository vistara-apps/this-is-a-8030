import React, { useState } from 'react'
import { Clock, Users, Heart, Edit, Bookmark } from 'lucide-react'
import { useRecipe } from '../context/RecipeContext'

const RecipeCard = ({ recipe, variant = 'detailed' }) => {
  const [isSaved, setIsSaved] = useState(false)
  const { saveRecipe } = useRecipe()

  const handleSave = () => {
    saveRecipe(recipe)
    setIsSaved(true)
  }

  if (variant === 'compact') {
    return (
      <div className="bg-surface border border-gray-200 rounded-lg p-4 shadow-card">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{recipe.title}</h3>
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{recipe.servings}</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleSave}
            className={`p-1 rounded ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-gray-200 rounded-lg overflow-hidden shadow-card">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary mb-1">{recipe.title}</h3>
            <p className="text-sm text-text-secondary">{recipe.description}</p>
          </div>
          <button 
            onClick={handleSave}
            className={`p-2 rounded-lg ml-2 ${
              isSaved 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
            } transition-colors`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Meta info */}
        <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Prep: {recipe.prepTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Cook: {recipe.cookTime}m</span>
          </div>
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div className="p-4 border-b">
        <h4 className="font-semibold text-text-primary mb-2">Ingredients</h4>
        <ul className="space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-sm text-text-secondary flex">
              <span className="text-primary mr-2">•</span>
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="p-4">
        <h4 className="font-semibold text-text-primary mb-2">Instructions</h4>
        <ol className="space-y-2">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="text-sm text-text-secondary flex">
              <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeCard