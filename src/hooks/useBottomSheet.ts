import { useEffect, useRef } from 'react';
import { MIN_Y, MAX_Y, SNAP_POINTS } from '../constant/BottomSheet';

interface BottomSheetMetrics {
  pointerStart: {
    sheetY: number;
    pointY: number;
  };
  pointerMove: {
    prevPointY: number;
    movingDirection: 'none' | 'up' | 'down';
  };
  isContentAreaTouched: boolean;
  isDraggingSheet: boolean;
}

const useBottomSheet = () => {
  const sheet = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const isPointerDownRef = useRef(false);

  const metrics = useRef<BottomSheetMetrics>({
    pointerStart: {
      sheetY: 0,
      pointY: 0,
    },
    pointerMove: {
      prevPointY: 0,
      movingDirection: 'none',
    },
    isContentAreaTouched: false,
    isDraggingSheet: false,
  });

  useEffect(() => {
    if (!sheet.current) return;

    // 초기 위치 설정 (중간 스냅 포인트)
    const initialY = SNAP_POINTS.HALF;
    const initialHeight = window.innerHeight - initialY;
    sheet.current.style.top = `${initialY}px`;
    sheet.current.style.height = `${initialHeight}px`;
    sheet.current.style.transition = 'top 0.3s ease-out, height 0.3s ease-out';

    // 바텀시트가 움직일 수 있는지 확인
    const canMoveBottomSheet = () => {
      const { pointerMove, isContentAreaTouched, isDraggingSheet } = metrics.current;

      // 이미 바텀시트를 드래그 중인 경우
      if (isDraggingSheet) {
        return true;
      }

      // 바텀시트 컨텐츠가 아닌 영역(헤더)을 터치했을 경우
      if (!isContentAreaTouched) {
        return true;
      }

      if (!content.current || !sheet.current) return false;

      const currentSheetY = sheet.current.getBoundingClientRect().y;

      // 바텀시트가 최대로 올라와 있지 않은 경우
      if (Math.abs(currentSheetY - MIN_Y) > 5) {
        return true;
      }

      // 컨텐츠를 아래로 스크롤할 때, 스크롤이 최상단에 있는 경우
      if (pointerMove.movingDirection === 'down' && content.current.scrollTop <= 0) {
        return true;
      }

      return false;
    };

    // 가장 가까운 스냅 포인트 찾기
    const findNearestSnapPoint = (currentY: number): number => {
      const snapValues = Object.values(SNAP_POINTS);
      return snapValues.reduce((prev, curr) => (Math.abs(curr - currentY) < Math.abs(prev - currentY) ? curr : prev)); // 현재 y값에서 더 가까운 값을 선택
    };

    // 드래그 시작
    const handlePointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true;
      const { pointerStart } = metrics.current;

      if (sheet.current) {
        pointerStart.sheetY = sheet.current.getBoundingClientRect().y;
        pointerStart.pointY = e.clientY;

        // transition 제거 (드래그 중에는 부드럽게 따라다니도록)
        sheet.current.style.transition = 'none';
      }
    };

    // 드래그
    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current || !sheet.current) return;

      const { pointerStart, pointerMove } = metrics.current;
      const currentPointer = e.clientY;

      // 이동 방향 계산
      if (pointerMove.prevPointY === 0) {
        pointerMove.prevPointY = pointerStart.pointY;
      }

      if (pointerMove.prevPointY < currentPointer) {
        pointerMove.movingDirection = 'down';
      } else if (pointerMove.prevPointY > currentPointer) {
        pointerMove.movingDirection = 'up';
      }

      pointerMove.prevPointY = currentPointer;

      // 바텀시트를 움직일 수 있는지 확인
      if (canMoveBottomSheet()) {
        metrics.current.isDraggingSheet = true;
        e.preventDefault();

        const pointerOffset = currentPointer - pointerStart.pointY;
        let nextSheetY = pointerStart.sheetY + pointerOffset;

        // 영역 제한
        if (nextSheetY <= MIN_Y) {
          nextSheetY = MIN_Y;
        }
        if (nextSheetY >= MAX_Y) {
          nextSheetY = MAX_Y;
        }

        // 바텀시트 위치 및 높이 업데이트
        const sheetHeight = window.innerHeight - nextSheetY;
        sheet.current.style.top = `${nextSheetY}px`;
        sheet.current.style.height = `${sheetHeight}px`;
      } else {
        // 컨텐츠 스크롤 허용
        metrics.current.isDraggingSheet = false;
      }
    };

    // 드래그 종료
    const handlePointerUp = () => {
      if (!sheet.current) return;

      isPointerDownRef.current = false;
      const { isDraggingSheet } = metrics.current;

      // transition 복원
      sheet.current.style.transition = 'top 0.3s ease-out, height 0.3s ease-out';

      // 바텀시트를 드래그했을 경우에만 스냅
      if (isDraggingSheet) {
        const currentSheetY = sheet.current.getBoundingClientRect().y;
        const nearestSnapPoint = findNearestSnapPoint(currentSheetY);

        // 가장 가까운 스냅 포인트로 이동
        const sheetHeight = window.innerHeight - nearestSnapPoint;
        sheet.current.style.top = `${nearestSnapPoint}px`;
        sheet.current.style.height = `${sheetHeight}px`;
      }

      // 메트릭 초기화
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
        isDraggingSheet: false,
      };
    };

    const sheetElement = sheet.current;

    sheetElement.addEventListener('pointerdown', handlePointerDown);
    sheetElement.addEventListener('pointermove', handlePointerMove);
    sheetElement.addEventListener('pointerup', handlePointerUp);
    sheetElement.addEventListener('pointerleave', handlePointerUp);

    return () => {
      if (!sheetElement) return;
      sheetElement.removeEventListener('pointerdown', handlePointerDown);
      sheetElement.removeEventListener('pointermove', handlePointerMove);
      sheetElement.removeEventListener('pointerup', handlePointerUp);
      sheetElement.removeEventListener('pointerleave', handlePointerUp);
    };
  }, []);

  // 컨텐츠 영역을 터치했을 경우
  useEffect(() => {
    const handleContentPointerDown = () => {
      metrics.current.isContentAreaTouched = true;
    };

    const node = content.current;
    node?.addEventListener('pointerdown', handleContentPointerDown);

    return () => {
      node?.removeEventListener('pointerdown', handleContentPointerDown);
    };
  }, []);

  return { sheet, content };
};

export default useBottomSheet;
