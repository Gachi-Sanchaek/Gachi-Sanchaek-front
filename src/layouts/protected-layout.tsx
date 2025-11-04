import { matchPath, Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import { useCategoryStore } from "../store/useCategoryStore";

const ProtectedLayout = () => {
  const location = useLocation();
  const isHome = !!matchPath("/", location.pathname);
  const isMyPage = !!matchPath("/mypage", location.pathname);

  const { selectedCategory } = useCategoryStore();

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div
        className={`w-full max-w-[480px] min-h-screen ${isHome || isMyPage ? "bg-gradient-to-b from-[#5FD59B] to-[#FFEC8A]" : "bg-white"}`}
      >
        <Header
          hasArrow={!isHome}
          title={isMyPage ? "마이 페이지" : selectedCategory}
          titleColor={isMyPage ? "white" : "black"}
          bgColor={isHome || isMyPage ? "transparent" : "white"}
        />
        <div className="pt-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
