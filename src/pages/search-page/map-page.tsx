import Category from '../../components/SearchPage/Category/Category';
import LocationInfoCard from '../../components/SearchPage/LocationInfoCard';

export default function MapPage() {
  return (
    <div>
      <Category />
      <LocationInfoCard location='서울 동물복지지원센터 마포' />
    </div>
  );
}
