import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Monetization from './components/monetization/Monetization'
import FlashCardApp from './components/FlashCardApp'
import About from './components/About'
import Navigation from './components/Navigation'
import { getRouterBasename } from './utils/routerUtils'

function App() {

  return (
    <Monetization>
      <Router basename={getRouterBasename()}>
        <Navigation />
        <Routes>
          <Route path="/" element={<FlashCardApp />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </Monetization>
  )
}

export default App