import { type RouteObject, createBrowserRouter, RouterProvider } from 'react-router-dom';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import Home from './pages/Home';
import MapPage from './pages/search-page/map-page';

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    // children:[
    //   {path:'login', element:<Login />}
    //   {path:'register', element:<Register />}
    // ]
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <MapPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
