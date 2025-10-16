import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Login } from './pages/login'
import { Home } from './pages/home'
import { History } from './pages/history '
import { ConfigureBaia } from './pages/configureBaia'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/history',
    element: <History />,
  },
  {
    path: '/configure-baia',
    element: <ConfigureBaia />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
