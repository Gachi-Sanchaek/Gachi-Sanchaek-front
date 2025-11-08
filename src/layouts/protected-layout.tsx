import { matchPath, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { useCategoryStore } from '../store/useCategoryStore';
import { useEffect } from 'react';

const ProtectedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const { selectedCategory } = useCategoryStore();

  const isHome = !!matchPath('/', location.pathname);
  const isMyPage = !!matchPath('/mypage', location.pathname);
  const isRanking = !!matchPath('/ranking', location.pathname);
  const isQRAuthPage = !!matchPath('/qr-auth', location.pathname);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <div className={`w-full max-w-[480px] min-h-screen ${isHome || isMyPage || isRanking ? 'bg-gradient-to-b from-[#5FD59B] to-[#FFEC8A]' : 'bg-white'}`}>
        {!isQRAuthPage && <Header hasArrow={!isHome} title={isMyPage ? '마이 페이지' : isRanking ? '랭킹' : selectedCategory} titleColor={isMyPage || isRanking ? 'white' : 'black'} bgColor={isHome || isMyPage || isRanking ? 'transparent' : 'white'} />}
        <div className={`${isQRAuthPage ? '' : 'pt-12'}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
