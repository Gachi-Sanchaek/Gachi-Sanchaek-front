export const walkType = (category: '산책' | '동행 산책' | '유기견 산책' | '플로깅') => {
  switch (category) {
    case '산책':
      return 'NORMAL';
    case '동행 산책':
      return 'SENIOR';
    case '유기견 산책':
      return 'DOG';
    case '플로깅':
      return 'PLOGGING';
  }
};
