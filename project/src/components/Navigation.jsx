import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <Link 
            to="/" 
            className={`py-4 px-6 border-b-2 transition-colors ${
              location.pathname === '/' 
                ? 'border-white text-white' 
                : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
            }`}
          >
            Flash Cards
          </Link>
          <Link 
            to="/battleship" 
            className={`py-4 px-6 border-b-2 transition-colors ${
              location.pathname === '/battleship' 
                ? 'border-white text-white' 
                : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
            }`}
          >
            Battleship
          </Link>
          <Link 
            to="/about" 
            className={`py-4 px-6 border-b-2 transition-colors ${
              location.pathname === '/about' 
                ? 'border-white text-white' 
                : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation