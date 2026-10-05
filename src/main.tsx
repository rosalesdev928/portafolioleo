import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App' // <- SIN .tsx
import PreferencesProvider from './context/PreferencesProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider><App /></PreferencesProvider>
  </StrictMode>
)
