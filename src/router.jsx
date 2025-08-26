import { createBrowserRouter } from 'react-router-dom'

import App from "./App"
import Login from "./routes/Login"
import Banned from "./routes/Banned"
import Inreview from "./routes/Inreview"
import Reviews from "./routes/Reviews"
import Reports from "./routes/Reports"
import Users from "./routes/Users"

 
// defining the router for the app
export const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/sticks', element: <App /> },
  { path: '/login', element: <Login /> },
  { path: '/banned', element: <Banned /> },
  { path: '/reviews', element: <Reviews /> },
  { path: '/in-review', element: <Inreview /> },
  { path: '/reports', element: <Reports /> },
  { path: '/users', element: <Users /> }
])
