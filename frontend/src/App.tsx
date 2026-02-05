import { createBrowserRouter, RouterProvider } from 'react-router';
import WorkSpacePage from './pages/workspace/WorkSpacePage';
import ErrorPage from './pages/error/ErrorPage';
import LandingPage from './pages/landing/LandingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/workspace/:workspaceId',
    element: <WorkSpacePage />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
