import WelfareCenter from '/assets/welfare-center-pin.svg';
import AnimalShelter from '/assets/animal-shelter-pin.svg';

// 마커 타입 반환
export const markerType = (category: string) => {
  switch (category) {
    case '동행 산책':
      return WelfareCenter;
    case '유기견 산책':
      return AnimalShelter;
    default:
      return undefined;
  }
};
