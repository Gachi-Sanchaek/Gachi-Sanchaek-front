import { locationList } from '../../../mocks/locationList';
import ListCard from '../ListCard';

const BottomSheetContent = () => {
  return (
    <div className='pb-3 px-3'>
      {locationList.map((loc) => (
        <ListCard key={loc.id} location={loc.name} address={loc.address} phoneNum={loc.phone} />
      ))}
    </div>
  );
};

export default BottomSheetContent;
