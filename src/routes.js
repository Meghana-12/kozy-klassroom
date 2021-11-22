import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import Assignments from './pages/Assignments';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './layouts/dashboard/AssignmentsViewer';
import NotFound from './pages/Page404';
import PrivateRoute from './components/PrivateRoute';
import Announcements from './pages/Announcements';
// import Assignments from './pages/Assignments';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { element: <Navigate to="/login" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'assignments', element: <Assignments /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'announcements', element: <Announcements /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
