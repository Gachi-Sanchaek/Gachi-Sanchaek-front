import { type RouteObject, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';

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
    children: [{ index: true, element: <Home /> }],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
