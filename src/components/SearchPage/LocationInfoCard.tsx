import BottomButton from '../common/BottomButton';
import ListCard from './ListCard';

interface LocationInfoCardProps {
  location: string;
  address?: string;
  phoneNum?: string;
}

const LocationInfoCard = ({ location, address, phoneNum }: LocationInfoCardProps) => {
  return (
    <div className='fixed bottom-5 flex flex-col w-full max-w-[480px]'>
      <ListCard location={location} address={address} phoneNum={phoneNum} />
      <div className='pt-10'>
        <BottomButton
          buttons={[
            { text: '코스 추천 받기', variant: 'white', onClick: () => console.log('코스 추천 받기') },
            { text: '바로 산책 시작', variant: 'green', onClick: () => console.log('바로 산책 시작') },
          ]}
        />
      </div>
    </div>
  );
};

export default LocationInfoCard;
