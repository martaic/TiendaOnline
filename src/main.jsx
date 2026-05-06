import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 1. Importas Bootstrap aquí (esto sustituye al <link>)
import 'bootstrap/dist/css/bootstrap.min.css'
// 2. Importas el JS de Bootstrap (esto sustituye al <script>)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'


import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)