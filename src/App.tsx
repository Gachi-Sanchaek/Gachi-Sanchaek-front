import {
  type RouteObject,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LogIn from "./pages/login-page";
import Home from "./pages/home-page";
import PublicLayout from "./layouts/public-layout";
import ProtectedLayout from "./layouts/protected-layout";
import SearchPage from "./pages/search-page";
import SignUp from "./pages/signup-page";
import WalkPage from "./pages/walk-page";
import WalkRoutePage from "./pages/walk-route-page";
import { KAKAO_OAUTH } from "./constant/kakao-constants";
import { KakaoOAuthHandler } from "./pages/kakao-oauth-handler";
import MyPage from "./pages/my-page";
import RankingPage from "./pages/ranking-page";
import QRAuthPage from "./pages/qr-auth-page";
import WalkRealtimePage from "./pages/walk-realtime-page";
import PloggingAuthPage from "./pages/plogging-auth-page";
import WalkEndPage from "./pages/walk-end-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "login", element: <LogIn /> },
      { path: "signup", element: <SignUp /> },
      { path: KAKAO_OAUTH, element: <KakaoOAuthHandler /> },
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
      { path: "walk", element: <WalkPage /> },
      { path: "walk/route", element: <WalkRoutePage /> },
      { path: "ranking", element: <RankingPage /> },
      { path: "walk/realtime", element: <WalkRealtimePage /> },
      { path: "qr-auth", element: <QRAuthPage /> },
      { path: "plogging-auth", element: <PloggingAuthPage /> },
      { path: "end", element: <WalkEndPage /> },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
