
import LoginPage from './pages/jsx/Auth'
import AdminDashboard from './pages/jsx/AdminDashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PresidentDashboard from './pages/jsx/PresidentDashboard';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />
    },
    {
      path: "/adminDashBoard",
      element: <AdminDashboard />
    },
    {
      path: "/presidentDashBoard",
      element: <PresidentDashboard />
    },
    {
      path: "/facultyDashBoard",
      element: <AdminDashboard />
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default App;
