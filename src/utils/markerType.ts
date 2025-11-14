// 마커 타입 반환
export const markerType = (category: string) => {
  switch (category) {
    case '동행 산책':
      return '/assets/welfare-center-pin.png';
    case '유기견 산책':
      return '/assets/animal-shelter-pin.png';
    default:
      return undefined;
  }
};
