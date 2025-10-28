export const MIN_Y = 60; // 바텀시트가 최대로 높이 올라갔을 때의 y 값
export const MAX_Y = window.innerHeight - 40; // 바텀시트가 최소로 내려갔을 때의 y 값

// 스냅 포인트들
export const SNAP_POINTS = {
  MAX: MIN_Y, // 완전히 열림
  HALF: window.innerHeight / 2, // 중간
  MIN: MAX_Y, // 거의 닫힘
} as const;
