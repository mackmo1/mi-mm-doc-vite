import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/main.scss'

// Set up jQuery globally BEFORE importing Trumbowyg
async function initApp() {
  // Step 1: Import jQuery and set it globally
  const jQuery = (await import('jquery')).default
  window.jQuery = window.$ = jQuery

  // Step 2: Now import Trumbowyg (it will find jQuery on window)
  await import('trumbowyg')
  await import('trumbowyg/dist/ui/trumbowyg.css')
  await import('trumbowyg/dist/plugins/colors/trumbowyg.colors.js')
  await import('trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.css')
  await import('trumbowyg/dist/plugins/history/trumbowyg.history.min.js')
  await import('trumbowyg/dist/plugins/base64/trumbowyg.base64.min.js')

  // Step 3: Import App component
  const { default: App } = await import('./App.jsx')

  // Step 4: Render the app
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

initApp()
