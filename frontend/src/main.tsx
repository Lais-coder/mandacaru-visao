import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Login } from './pages/login'
import { Home } from './pages/home'
<<<<<<< HEAD
import { History } from './pages/history '
=======
import { ConfigureBaia } from './pages/configureBaia'
>>>>>>> 6739d49dc89c6219f04141d7401cbc8ee04482a1

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
<<<<<<< HEAD
    path: '/history',
    element: <History />,
=======
    path: '/configure-baia',
    element: <ConfigureBaia />,
>>>>>>> 6739d49dc89c6219f04141d7401cbc8ee04482a1
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
