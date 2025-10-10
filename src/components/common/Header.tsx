import { useNavigate } from 'react-router-dom';
import ArrowUp from '/src/assets/arrow-up.svg';

interface HeaderProps {
  hasArrow?: boolean;
  title?: string;
}

const Header = ({ hasArrow = false, title }: HeaderProps) => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <div className='fixed top-0 w-full max-w-[480px] bg-transparent z-50 py-2.5'>
      {hasArrow ? (
        <div className='flex items-center justify-center px-6'>
          <button type='button' className='absolute left-6 cursor-pointer' onClick={handleClickBack}>
            <img src={ArrowUp} alt='뒤로가기' className='w-6 h-6' />
          </button>
          <h1 className='font-[PretendardVariable] font-semibold text-white text-[18px] select-none'>{title}</h1>
        </div>
      ) : (
        <h1 className='pl-6 font-[Cafe24Ssurround] font-bold text-[28px] text-white select-none'>가치 산책</h1>
      )}
    </div>
  );
};

export default Header;
