//현재위치 마커 방향 회전 추가
export type CurrentMarkerHandle = {
  overlay: kakao.maps.CustomOverlay;
  root: HTMLDivElement;
  arrowEl: HTMLDivElement;
};

type CreateOptions = {
  heading?: number; //deg 0=북쪽, 시계방향
  zIndex?: number;
};

export function createCurrentMarker(
  map: kakao.maps.Map,
  position: kakao.maps.LatLng,
  opts: CreateOptions = {}
): CurrentMarkerHandle {
  const { heading = 0, zIndex = 100 } = opts;

  const root = document.createElement("div");
  root.style.position = "relative";
  root.style.width = "44px";
  root.style.height = "44px";
  root.style.transform = "translate(-50%, -50%)";
  root.style.pointerEvents = "none";

  //연한 오라
  const aura = document.createElement("div");
  aura.style.position = "absolute";
  aura.style.left = "50%";
  aura.style.top = "50%";
  aura.style.transform = "translate(-50%, -50%)";
  aura.style.width = "44px";
  aura.style.height = "44px";
  aura.style.borderRadius = "9999px";
  aura.style.background = "rgba(95, 213, 155, 0.25)";
  root.appendChild(aura);

  //중앙 원
  const dotWrap = document.createElement("div");
  dotWrap.style.position = "absolute";
  dotWrap.style.left = "50%";
  dotWrap.style.top = "50%";
  dotWrap.style.transform = "translate(-50%, -50%)";
  dotWrap.style.width = "18px";
  dotWrap.style.height = "18px";
  dotWrap.style.borderRadius = "9999px";
  dotWrap.style.background = "#5FD59B";
  dotWrap.style.boxShadow = "0 0 0 2px #ffffff";
  root.appendChild(dotWrap);

  //방향 삼각형 (회전해야함)
  const arrowEl = document.createElement("div");
  arrowEl.style.position = "absolute";
  arrowEl.style.left = "8px";
  arrowEl.style.top = "26px";

  arrowEl.style.width = "0";
  arrowEl.style.height = "0";
  arrowEl.style.borderLeft = "6px solid transparent";
  arrowEl.style.borderRight = "6px solid transparent";
  arrowEl.style.borderTop = "10px solid #5FD59B";
  arrowEl.style.filter = "drop-shadow(0 0 1px rgba(255,255,255,0.9))"; //외곽선 대신 수정

  arrowEl.style.transformOrigin = "50% -8px";
  setHeading(arrowEl, heading);
  root.appendChild(arrowEl);

  const overlay = new kakao.maps.CustomOverlay({
    position,
    content: root,
    yAnchor: 0.5,
    zIndex,
  });

  overlay.setMap(map);

  return { overlay, root, arrowEl };
}

//헤드 회전
function setHeading(arrowEl: HTMLDivElement, deg: number) {
  arrowEl.style.transform = `rotate(${deg}deg)`;
}

export function updateCurrentMarker(
  handle: CurrentMarkerHandle,
  position?: kakao.maps.LatLng,
  heading?: number
) {
  if (position) handle.overlay.setPosition(position);
  if (typeof heading === "number") setHeading(handle.arrowEl, heading);
}

export function removeCurrentMarker(handle: CurrentMarkerHandle) {
  handle.overlay.setMap(null);
}
