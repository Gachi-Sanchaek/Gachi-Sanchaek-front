import { matchPath, Outlet, useLocation } from "react-router-dom";

const PublicLayout = () => {
  const location = useLocation();
  const isLogin = !!matchPath("/login", location.pathname);

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div
        className={`w-full max-w-[480px] min-h-screen bg-white ${isLogin ? "mt-0" : "mt-2.5"}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
