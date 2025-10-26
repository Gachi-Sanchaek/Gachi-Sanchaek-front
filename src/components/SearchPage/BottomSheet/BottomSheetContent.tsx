// import Category from '../../components/SearchPage/Category/Category';
// import LocationInfoCard from '../../components/SearchPage/LocationInfoCard';
import { locationList } from '../../../mocks/locationList';
import ListCard from '../ListCard';

const BottomSheetContent = () => {
  return (
    <div
      className={`pb-5 overflow-scroll [&::-webkit-scrollbar]:hidden`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {locationList.map((loc) => (
        <ListCard key={loc.id} location={loc.name} address={loc.address} phoneNum={loc.phone} />
      ))}

      {/* <LocationInfoCard location='서울 동물복지지원센터 마포' /> */}
    </div>
  );
};

export default BottomSheetContent;
