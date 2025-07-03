
import LoginPage from './pages/jsx/Auth'
import AdminDashboard from './pages/jsx/AdminDashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PresidentDashboard from './pages/jsx/PresidentDashboard';
import FacultyDashboard from './pages/jsx/FacultyDashboard';
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
      element: <FacultyDashboard />
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default App;
