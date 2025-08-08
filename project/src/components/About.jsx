import React from 'react'

function About() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Why Math is So Important</h1>
      
      <div className="space-y-6 text-gray-700">
        <p className="text-lg leading-relaxed">
          Mathematics is the universal language that helps us understand and navigate our world. 
          From the moment we wake up to the time we go to sleep, math influences nearly every 
          aspect of our daily lives.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Critical Thinking & Problem Solving</h2>
          <p className="leading-relaxed">
            Math teaches us to think logically, analyze problems systematically, and develop 
            creative solutions. These skills are transferable to every field and help us make 
            better decisions in life.
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Career Opportunities</h2>
          <p className="leading-relaxed">
            Strong mathematical skills open doors to countless career paths including engineering, 
            medicine, finance, technology, research, and data science. Even in creative fields, 
            mathematical thinking provides a competitive advantage.
          </p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibent mb-4 text-purple-800">Understanding Our World</h2>
          <p className="leading-relaxed">
            Mathematics helps us understand patterns in nature, predict weather, explore space, 
            develop new technologies, and solve global challenges like climate change and disease.
          </p>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibol mb-4 text-orange-800">Financial Literacy</h2>
          <p className="leading-relaxed">
            Basic math skills are essential for managing personal finances, understanding loans 
            and investments, budgeting effectively, and making informed economic decisions.
          </p>
        </div>
        
        <p className="text-lg leading-relaxed font-medium">
          Flash cards are an excellent way to build mathematical fluency and confidence. 
          Regular practice helps develop the mental math skills that form the foundation 
          for more advanced mathematical concepts.
        </p>
      </div>
    </div>
  )
}

export default About