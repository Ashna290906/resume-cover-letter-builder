import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMagic } from '@fortawesome/free-solid-svg-icons'

// Add the magic icon to the library
library.add(faMagic)

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (error) {
  console.error('Error rendering application:', error)
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-red-600">Application Error</h1>
          <p class="mt-2 text-gray-600">An error occurred while loading the application.</p>
          <p class="mt-2 text-gray-600">Please check the browser console for more details.</p>
        </div>
      </div>
    `
  }
}