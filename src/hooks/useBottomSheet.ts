import { useEffect, useRef } from 'react';
import { MAX_Y, MIN_Y } from '../constant/BottomSheet';

interface BottomSHeetMetrics {
  pointerStart: {
    sheetY: number;
    pointY: number;
  };
  pointerMove: {
    prevPointY: number;
    movingDirection: 'none' | 'up' | 'down';
  };
  isContentAreaTouched: boolean;
}

const useBottomSheet = () => {
  const sheet = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);

  // 초기화
  const metrics = useRef<BottomSHeetMetrics>({
    pointerStart: {
      sheetY: 0,
      pointY: 0,
    },
    pointerMove: {
      prevPointY: 0,
      movingDirection: 'none',
    },
    isContentAreaTouched: false,
  });

  useEffect(() => {
    // 바텀시트가 움직을 수 있는지 확인
    const canMoveBottomSheet = () => {
      const { pointerMove, isContentAreaTouched } = metrics.current;

      // 바텀시트 컨텐츠가 아닌 영역을 터치했을 경우
      if (!isContentAreaTouched) {
        return true;
      }

      // 바텀시크가 최대로 올라와 있는 상태가 아닐 경우
      if (sheet.current!.getBoundingClientRect().y !== MIN_Y) {
        return true;
      }

      // 더 이상 불러올 컨텐츠 내용이 없을 경우(컨텐츠의 최상단)
      if (pointerMove.movingDirection === 'down') {
        return content.current!.scrollTop <= 0;
      }

      // 위 조건에 만족하지 않는 경우 바텀시트 이동 불가
      return false;
    };

    //  드래그 시작
    const handlePointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true;
      const { pointerStart } = metrics.current;
      pointerStart.sheetY = sheet.current!.getBoundingClientRect().y; // 바텀시트의 최상단 높이의 y값
      pointerStart.pointY = e.clientY; // 처음 터치한 y값
    };

    // 드래그
    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const { pointerStart, pointerMove } = metrics.current;
      const currentPointer = e.clientY; // 현재 터치하는 y값

      // prevPointY값이 없으면 처음 터치한 y값 대입
      if (pointerMove.prevPointY === undefined) {
        pointerMove.prevPointY = pointerMove.prevPointY || pointerStart.pointY;
      }

      // 초기 렌더링
      if (pointerMove.prevPointY === 0) {
        pointerMove.prevPointY = pointerStart.pointY;
      }

      // 현재 y값이 처음 터치한 y값보다 크면 down(아래로 이동)
      if (pointerMove.prevPointY < currentPointer) {
        pointerMove.movingDirection = 'down';
      }

      // 현재 y값이 처음 터치한 y값보다 작으면 up(위로 이동)
      if (pointerMove.prevPointY > currentPointer) {
        pointerMove.movingDirection = 'up';
      }

      // 바텀 시트를 움직일 수 있는 경우, 이동 값만큼 계산
      if (canMoveBottomSheet()) {
        e.preventDefault();

        // 이동 후 바텀 시트의 최상단 높이의 y값
        // 시작할 때 sheetY값에서 이동해야 하는 만큼(pointerOffset) 계산
        const pointerOffset = currentPointer - pointerStart.pointY;
        let nextSheetY = pointerStart.sheetY + pointerOffset;

        // 바텀 시트는 MIN_Y 이하, MAX_Y 이싱의 영역에 위치할 경우, 영역 제한
        if (nextSheetY <= MIN_Y) {
          nextSheetY = MIN_Y;
        }

        if (nextSheetY >= MAX_Y) {
          nextSheetY = MAX_Y;
        }

        // y값 계산(닫힌 상태를 기준으로)
        if (sheet.current) {
          sheet.current.style.transform = `translateY(${nextSheetY - MIN_Y}px)`;
        }
      }
      // 컨텐츠 스크롤 시, 바텀 시트가 스크롤되는 것을 방지
      else {
        document.body.style.overflowY = 'hidden';
      }
    };

    // 드래그 종료
    const handlePointerUp = () => {
      isPointerDownRef.current = false;
      document.body.style.overflowY = 'auto';
      // const { pointerMove } = metrics.current;
      // const currentSheetY = sheet.current!.getBoundingClientRect().y;

      // if (currentSheetY !== MIN_Y) {
      //   if (pointerMove.movingDirection === 'down') {
      //     sheet.current!.style.setProperty('transform', 'translateY(0)');
      //   }

      //   if (pointerMove.movingDirection === 'up') {
      //     sheet.current!.style.setProperty('transform', `translateY(${MIN_Y - MAX_Y}px)`);
      //   }
      // }

      // 초기화
      metrics.current = {
        pointerStart: {
          sheetY: 0,
          pointY: 0,
        },
        pointerMove: {
          prevPointY: 0,
          movingDirection: 'none',
        },
        isContentAreaTouched: false,
      };
    };

    const sheetElement = sheet.current;

    sheetElement?.addEventListener('pointerdown', handlePointerDown);
    sheetElement?.addEventListener('pointermove', handlePointerMove);
    sheetElement?.addEventListener('pointerup', handlePointerUp);
    sheetElement?.addEventListener('pointerleave', handlePointerUp);

    return () => {
      if (!sheetElement) return;

      sheetElement?.removeEventListener('pointerdown', handlePointerDown);
      sheetElement?.removeEventListener('pointermove', handlePointerMove);
      sheetElement?.removeEventListener('pointerup', handlePointerUp);
      sheetElement?.removeEventListener('pointerleave', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const onContentPointerDown = () => {
      metrics.current!.isContentAreaTouched = true;
    };

    const node = content.current;
    node?.addEventListener('pointerdown', onContentPointerDown, true);
    return () => node?.removeEventListener('pointerdown', onContentPointerDown, true);
  }, []);

  return { sheet, content };
};

export default useBottomSheet;
