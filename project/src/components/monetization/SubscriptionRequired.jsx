import { useState } from 'react'

function SubscriptionRequired() {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      period: 'month',
      popular: false,
      features: ['Full access to all content', 'Cancel anytime', 'Premium support']
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$99.99',
      period: 'year',
      popular: true,
      features: ['Full access to all content', 'Cancel anytime', 'Premium support', 'Save 17%']
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$299.99',
      period: 'one-time',
      popular: false,
      features: ['Full access to all content', 'Lifetime updates', 'Premium support', 'No recurring fees']
    }
  ]

  const handleSubscribe = async () => {
    setIsProcessing(true)
    try {
      // Simulate subscription processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would integrate with your actual subscription service
      // Examples: Stripe Subscriptions, PayPal Subscriptions, etc.
      console.log('Processing subscription for plan:', selectedPlan)
      
      // Simulate successful subscription
      console.log('Subscription successful!')
      
      // Handle successful subscription (e.g., redirect or update parent state)
      // You might want to pass a callback prop to handle this
      
    } catch (error) {
      console.error('Subscription failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getSelectedPlan = () => {
    return plans.find(plan => plan.id === selectedPlan)
  }

  return (
    <div className="text-2xl bg-slate-600 h-screen w-screen text-white flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Subscription Required</h2>
        <p className="text-lg mb-8">Choose a subscription plan to access this content.</p>
        
        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 bg-slate-700 hover:border-gray-500'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-purple-400">{plan.price}</span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>
              
              <ul className="text-sm text-gray-300 space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className={`w-full h-1 rounded-full ${
                selectedPlan === plan.id ? 'bg-purple-500' : 'bg-gray-600'
              }`}></div>
            </div>
          ))}
        </div>

        {/* Selected Plan Summary */}
        <div className="mb-6 p-4 bg-slate-700 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-gray-300 mb-1">Selected Plan</p>
          <p className="text-xl font-bold text-purple-400">
            {getSelectedPlan().name} - {getSelectedPlan().price}/{getSelectedPlan().period}
          </p>
        </div>

        {/* Subscribe Button */}
        <button 
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full max-w-md px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Subscription...
            </div>
          ) : (
            `Subscribe to ${getSelectedPlan().name} Plan`
          )}
        </button>
        
        {/* Trust Indicators */}
        <div className="mt-6 text-sm text-gray-400 space-y-1">
          <p>🔒 Secure payment processing • Cancel anytime</p>
          <p>💳 Multiple payment methods accepted</p>
          <p>🛡️ 30-day money-back guarantee</p>
        </div>
        
        {/* Terms */}
        <p className="text-xs text-gray-500 mt-4">
          By subscribing, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  )
}

export default SubscriptionRequired 