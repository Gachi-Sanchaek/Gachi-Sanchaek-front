import { matchPath, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';

const ProtectedLayout = () => {
  const location = useLocation();

  const isHome = !!matchPath('/', location.pathname);

  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <div className={`w-full max-w-[480px] min-h-screen ${isHome ? 'bg-gradient-to-b from-[#5FD59B] to-[#FFEC8A]' : 'bg-white'}`}>
        <Header hasArrow={true} title='산책' />
      </div>
    </div>
  );
};

export default ProtectedLayout;
