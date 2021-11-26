import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './components-used/dashboard-layout';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Assignments from './pages/Assignments';
import Products from './pages/Products';
import Blog from './pages/Blog';
import NotFound from './pages/Page404';
import PrivateRoute from './components/PrivateRoute';
import Announcements from './pages/Announcements';
import Students from './pages/Students';
import { Submissions } from './pages/Submissions';
import SubmissionsViewer from './components-used/Assignments/Viewer/Submissions';
import SubmissionsAssignment from './components-used/SubmissionsAssignment';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { element: <Navigate to="/login" replace /> },
        { path: 'login', element: <Login /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        // { path: '/', element: <Assignments /> },
        { path: 'assignments', element: <Assignments /> },
        { path: 'students', element: <Students /> },
        { path: 'announcements', element: <Announcements /> },
        { path: 'submissions', element: <Submissions /> },
        { path: 'submissions/assignment', element: <SubmissionsAssignment /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
