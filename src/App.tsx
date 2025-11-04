import {
  type RouteObject,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import PublicLayout from "./layouts/public-layout";
import ProtectedLayout from "./layouts/protected-layout";
import SearchPage from "./pages/search-page";
import SignUp from "./pages/SignUp";
import { KAKAO_OAUTH } from "./utils/kakao-constants";
import { KakaoOAuthHandler } from "./pages/KakaoOAuthHandler";
import MyPage from "./pages/my-page";
import RankingPage from "./pages/ranking-page";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "login", element: <LogIn /> },
      { path: "signup", element: <SignUp /> },
      { path: KAKAO_OAUTH, element: <KakaoOAuthHandler /> },
      //   {path:'register', element:<Register />}
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "mypage", element: <MyPage /> },
      { path: "ranking", element: <RankingPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
