import { useNavigate } from 'react-router-dom';
import type { Place } from '../../types/place';
import BottomButton from '../common/BottomButton';
import ListCard from './ListCard';
import Close from '/src/assets/close.svg';

interface LocationInfoCardProps {
  place: Place;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: () => void;
}

const LocationInfoCard = ({ place, setSelectedPlace, setShowBottomSheet, onClick }: LocationInfoCardProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setSelectedPlace(null);
    setShowBottomSheet(true);
  };

  const handleRouteRecommend = () => {
    navigate('/walk');
  };

  return (
    <div className='fixed w-full max-w-[480px] bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg p-3 z-50'>
      <button type='button' className='absolute right-3 p-1 cursor-pointer' onClick={handleClose}>
        <img src={Close} alt='close' />
      </button>
      <div className='pt-6'>
        <ListCard place={place} />
      </div>
      <div className='pt-3'>
        <BottomButton
          buttons={[
            { text: '코스 추천 받기', variant: 'white', onClick: handleRouteRecommend },
            { text: '바로 산책 시작', variant: 'green', onClick: onClick },
          ]}
        />
      </div>
    </div>
  );
};

export default LocationInfoCard;
