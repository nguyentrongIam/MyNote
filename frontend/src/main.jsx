import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Settings from './Settings.jsx'
import Notes from './Notes'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Settings />
    <Notes/>
  </StrictMode>,
)
