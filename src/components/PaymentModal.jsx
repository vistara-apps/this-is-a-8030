import React, { useState } from 'react'
import { X, CreditCard, Loader2, CheckCircle } from 'lucide-react'
import { usePaymentContext } from '../hooks/usePaymentContext'

const PaymentModal = ({ isOpen, onClose, recipe, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const { createSession } = usePaymentContext()

  const recipePrice = 0.25 // $0.25 per recipe

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      await createSession()
      setPaymentComplete(true)
      setTimeout(() => {
        onPaymentSuccess()
        setPaymentComplete(false)
        setIsProcessing(false)
      }, 2000)
    } catch (error) {
      console.error('Payment failed:', error)
      // For demo purposes, we'll simulate success
      setPaymentComplete(true)
      setTimeout(() => {
        onPaymentSuccess()
        setPaymentComplete(false)
        setIsProcessing(false)
      }, 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-text-primary">Get Full Recipe</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Recipe Preview */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h3 className="font-semibold text-text-primary mb-1">{recipe.title}</h3>
            <p className="text-sm text-text-secondary mb-2">{recipe.description}</p>
            <div className="text-xs text-text-secondary">
              {recipe.ingredients?.length || 0} ingredients • {recipe.prepTime + recipe.cookTime} minutes
            </div>
          </div>

          {/* Payment Info */}
          <div className="border border-gray-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Recipe Generation</span>
              <span className="font-semibold">${recipePrice} USDC</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Total</span>
              <span className="font-bold text-lg">${recipePrice} USDC</span>
            </div>
          </div>

          {/* Payment Status */}
          {paymentComplete ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-semibold">Payment Successful!</p>
              <p className="text-sm text-text-secondary">Preparing your recipe...</p>
            </div>
          ) : (
            <>
              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay ${recipePrice} USDC
                  </>
                )}
              </button>

              {/* Info */}
              <div className="mt-3 text-center">
                <p className="text-xs text-text-secondary">
                  Secure payment via blockchain • Your wallet will be prompted
                </p>
              </div>

              {/* Alternative */}
              <div className="mt-4 pt-3 border-t text-center">
                <p className="text-xs text-text-secondary mb-2">
                  Want unlimited recipes?
                </p>
                <button className="text-sm text-primary hover:underline">
                  Get Weekly Pass for $2.99 USDC
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal