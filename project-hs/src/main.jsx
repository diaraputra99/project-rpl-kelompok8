import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'
import AdminApp from './components/ADMIN/adminAPP.jsx'

// Routing sederhana: /admin → AdminApp, yang lain → App (customer)
const isAdmin     = window.location.pathname.startsWith('/admin')
const params      = new URLSearchParams(window.location.search)
const tableNumber = params.get('meja') ? Number(params.get('meja')) : null

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminApp /> : <App tableNumber={tableNumber} />}
  </StrictMode>,
)