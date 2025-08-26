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
  { path: 'bashuadmin/', element: <App /> },
  { path: 'bashuadmin/sticks', element: <App /> },
  { path: 'bashuadmin/login', element: <Login /> },
  { path: 'bashuadmin/banned', element: <Banned /> },
  { path: 'bashuadmin/reviews', element: <Reviews /> },
  { path: 'bashuadmin/in-review', element: <Inreview /> },
  { path: 'bashuadmin/reports', element: <Reports /> },
  { path: 'bashuadmin/users', element: <Users /> }
])
