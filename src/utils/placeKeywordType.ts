export const keywordType = (category: string) => {
  switch (category) {
    case '동행 산책':
      return 'SENIOR';
    case '유기견 산책':
      return 'ANIMAL';
    default:
      return '';
  }
};
