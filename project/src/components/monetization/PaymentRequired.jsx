import { useState } from 'react'

function PaymentRequired() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card', 'paypal', 'stripe'

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would integrate with your actual payment processor
      // Examples: Stripe, PayPal, Square, etc.
      console.log('Processing payment with method:', paymentMethod)
      
      // Simulate successful payment
      console.log('Payment successful!')
      
      // Handle successful payment (e.g., redirect or update parent state)
      // You might want to pass a callback prop to handle this
      
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }

  return (
    <div className="text-2xl bg-slate-600 h-screen w-screen text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-4">Payment Required</h2>
        <p className="text-lg mb-6">This content requires a one-time payment.</p>
        
        {/* Payment Method Selection */}
        <div className="mb-6">
          <p className="text-sm mb-3">Select payment method:</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handlePaymentMethodChange('card')}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                paymentMethod === 'card' 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-400 text-gray-300 hover:border-gray-300'
              }`}
            >
              💳 Card
            </button>
            <button
              onClick={() => handlePaymentMethodChange('paypal')}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                paymentMethod === 'paypal' 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-400 text-gray-300 hover:border-gray-300'
              }`}
            >
              🅿️ PayPal
            </button>
            <button
              onClick={() => handlePaymentMethodChange('stripe')}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                paymentMethod === 'stripe' 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-400 text-gray-300 hover:border-gray-300'
              }`}
            >
              💳 Stripe
            </button>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <p className="text-sm text-gray-300 mb-1">Payment Amount</p>
          <p className="text-2xl font-bold text-green-400">$9.99</p>
          <p className="text-xs text-gray-400 mt-1">One-time payment</p>
        </div>

        {/* Pay Button */}
        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay Now with ${paymentMethod === 'card' ? 'Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}`
          )}
        </button>
        
        {/* Security Notice */}
        <p className="text-xs text-gray-400 mt-4">
          🔒 Secure payment processing • Your data is protected
        </p>
        
        {/* Terms */}
        <p className="text-xs text-gray-500 mt-2">
          By proceeding, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  )
}

export default PaymentRequired 