import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Đảm bảo bạn đã cấu hình Tailwind CSS ở file này
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)