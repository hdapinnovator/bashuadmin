import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// import react router dom
import { RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { router } from './router.jsx'
import OnlyAdmin from './components/OnlyAdmin.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
)
