/// <reference types="kakao.maps.d.ts" />

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export {};

/* declare global {
  interface Window {
    kakao: any;
  }
} */
