import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Import SCSS styles
import './scss/main.scss'

// Import jQuery globally for Trumbowyg
import $ from 'jquery'
window.jQuery = window.$ = $

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
