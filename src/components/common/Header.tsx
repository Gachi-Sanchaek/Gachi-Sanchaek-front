import { useNavigate } from 'react-router-dom';
import BackWhite from '/src/assets/back-white.svg';
import BackBlack from '/src/assets/back-black.svg';

interface HeaderProps {
  hasArrow?: boolean;
  title?: string;
  titleColor?: 'black' | 'white';
}

const Header = ({ hasArrow = false, title, titleColor = 'white' }: HeaderProps) => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <header className='fixed top-0 w-full max-w-[480px] bg-transparent z-50 py-2.5'>
      {hasArrow ? (
        <div className='flex items-center justify-center px-6'>
          <button type='button' className='absolute left-6 cursor-pointer' onClick={handleClickBack}>
            <img src={titleColor === 'white' ? BackWhite : BackBlack} alt='뒤로가기' className='w-6 h-6' />
          </button>
          <h1 className={`font-[PretendardVariable] font-semibold text-${titleColor} text-[18px] select-none`}>{title}</h1>
        </div>
      ) : (
        <h1 className='pl-6 font-[Cafe24Ssurround] font-bold text-[28px] text-white select-none'>가치 산책</h1>
      )}
    </header>
  );
};

export default Header;
