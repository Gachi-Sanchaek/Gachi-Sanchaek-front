import { useEffect, useState } from 'react';
import BottomSheet from '../components/SearchPage/BottomSheet/BottomSheet';
import Category from '../components/SearchPage/Category/Category';
import KakaoMap from '../components/SearchPage/KakaoMap';
import { useCategoryStore } from '../store/useCategoryStore';

export default function SearchPage() {
  const { selectedCategory } = useCategoryStore();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  useEffect(() => {
    if (selectedCategory === '산책' || selectedCategory === '플로깅') {
      setShowBottomSheet(false);
    } else {
      setShowBottomSheet(true);
    }
  }, [selectedCategory]);

  return (
    <div>
      {/* base layer */}
      <div>
        <Category />
        <KakaoMap selectedCategory={selectedCategory} />
      </div>
      {showBottomSheet && <BottomSheet />}
    </div>
  );
}
