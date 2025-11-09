export const keywordType = (category: string) => {
  switch (category) {
    case '동행 산책':
      return '복지관';
    case '유기견 산책':
      return '입양';
    default:
      return '';
  }
};
