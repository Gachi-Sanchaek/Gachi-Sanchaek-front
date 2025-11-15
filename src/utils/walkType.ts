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

export const walkAuthType = (type: string) => {
  switch (type) {
    case 'NORMAL':
      return '일반 산책';
    case 'SENIOR':
      return '동행 산책';
    case 'DOG':
      return '유기견 산책';
    case 'PLOGGING':
      return '플로깅 산책';
  }
};
