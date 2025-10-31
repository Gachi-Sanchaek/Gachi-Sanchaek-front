import BottomSheet from '../components/SearchPage/BottomSheet/BottomSheet';
import Category from '../components/SearchPage/Category/Category';
import KakaoMap from '../components/SearchPage/KakaoMap';
import { useCategoryStore } from '../store/useCategoryStore';

export default function SearchPage() {
  const { selectedCategory } = useCategoryStore();

  return (
    <div>
      {/* base layer */}
      <div>
        <Category />
        <KakaoMap />
      </div>
      {selectedCategory !== '산책' && <BottomSheet />}
    </div>
  );
}
