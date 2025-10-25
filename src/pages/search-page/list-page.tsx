import ListCard from '../../components/SearchPage/ListCard';
import { locationList } from '../../mocks/locationList';

export default function ListPage() {
  return (
    <div>
      {locationList.map((loc) => (
        <ListCard key={loc.id} location={loc.name} address={loc.address} phoneNum={loc.phone} />
      ))}
    </div>
  );
}
