import { type RouteObject, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Home from './pages/Home';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import SearchPage from './pages/search-page';

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: 'login', element: <LogIn /> },
      //   {path:'register', element:<Register />}
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <SearchPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
