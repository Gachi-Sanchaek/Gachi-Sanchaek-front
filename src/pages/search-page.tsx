import { useEffect, useRef, useState } from 'react';
import BottomSheet from '../components/SearchPage/BottomSheet/BottomSheet';
import Category from '../components/SearchPage/Category/Category';
import KakaoMap from '../components/SearchPage/KakaoMap';
import { CategoryStore } from '../store/CategoryStore';
import type { Place } from '../types/place';
import LocationInfoCard from '../components/SearchPage/LocationInfoCard';
import BottomButton from '../components/common/BottomButton';
import { useNavigate } from 'react-router-dom';
import { postWalkStart, postWalkStateChange } from '../apis/walk';
import { walkType } from '../utils/walkType';
import { postPlaceStore } from '../apis/place';
import { keywordType } from '../utils/placeKeywordType';

export default function SearchPage() {
  const navigate = useNavigate();
  const { selectedCategory } = CategoryStore();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[] | null>(null);

  const isAllowedCategory = selectedCategory === '산책' || selectedCategory === '플로깅';

  useEffect(() => {
    // 카테고리가 바뀔 때마다 선택된 장소 초기화
    setSelectedPlace(null);

    // 카테고리에 따라 BottomSheet 제어
    if (selectedCategory === '산책' || selectedCategory === '플로깅') {
      // 일반 산책/플로깅은 BottomSheet 닫기
      setShowBottomSheet(false);
    } else if (selectedCategory === '동행 산책' || selectedCategory === '유기견 산책') {
      // 동행 산책/유기견 산책은 BottomSheet 열기
      setShowBottomSheet(true);
    } else {
      // 나머지는 기본적으로 BottomSheet 닫기
      setShowBottomSheet(false);
    }
  }, [selectedCategory]);

  const handleWalkStart = async () => {
    try {
      const data = await postWalkStart({
        recommendationId: null,
        walkType: walkType(selectedCategory),
      });

      if (data.status === 200) {
        localStorage.setItem('walkId', data.data.walkId.toString());

        if (selectedCategory === '산책' || selectedCategory === '플로깅') {
          try {
            const res = await postWalkStateChange(data.data.walkId);

            if (res.status === 200) {
              navigate('/walk/realtime');
            } else {
              alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
            }
          } catch (e) {
            alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
            console.error('walk connect error', e);
          }
        } else if (selectedCategory === '동행 산책' || selectedCategory === '유기견 산책') {
          navigate('/qr-auth');
        }
      } else {
        alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (e) {
      alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
      console.error('Walk Start Error', e);
    }
  };

  const handleStorePlace = async () => {
    console.log(selectedPlace, keywordType(selectedCategory));

    if (selectedPlace) {
      try {
        const data = await postPlaceStore(selectedPlace, keywordType(selectedCategory));

        console.log(data.data);

        if (data.status === 200) {
          navigate('/walk', {
            state: {
              orgId: data.data.id,
            },
          });
        } else {
          alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
        }
      } catch (e) {
        alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
        console.error('place store error', e);
      }
    } else {
      console.error('place not selected');
    }
  };

  return (
    <div>
      <div>
        <Category />
        <KakaoMap selectedCategory={selectedCategory} setShowBottomSheet={setShowBottomSheet} setPlaces={setPlaces} setSelectedPlace={setSelectedPlace} mapRefExternal={mapRef} markersRefExternal={markersRef} />
      </div>
      {selectedPlace && !showBottomSheet && !isAllowedCategory && <LocationInfoCard place={selectedPlace} setSelectedPlace={setSelectedPlace} setShowBottomSheet={setShowBottomSheet} onClickWalkStart={handleWalkStart} onClickRouteRecommend={handleStorePlace} />}
      {showBottomSheet && <BottomSheet places={places} setSelectedPlace={setSelectedPlace} setShowBottomSheet={setShowBottomSheet} mapRef={mapRef} markersRef={markersRef} />}
      {!showBottomSheet && !selectedPlace && isAllowedCategory && (
        <div className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50'>
          <BottomButton
            buttons={[
              {
                text: '코스 추천 받기',
                variant: 'white',
                onClick: () => navigate('/walk'),
              },
              { text: '바로 산책 시작', variant: 'green', onClick: handleWalkStart },
            ]}
          />
        </div>
      )}
    </div>
  );
}
