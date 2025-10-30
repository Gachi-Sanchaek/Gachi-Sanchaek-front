import BottomSheet from '../components/SearchPage/BottomSheet/BottomSheet';
import Category from '../components/SearchPage/Category/Category';
import KakaoMap from '../components/SearchPage/KakaoMap';

export default function SearchPage() {
  return (
    <div>
      {/* base layer */}
      <div>
        <Category />
        <KakaoMap />
      </div>
      <BottomSheet />
    </div>
  );
}
