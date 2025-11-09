export type CurrentMarkerHandle = {
  overlay: kakao.maps.CustomOverlay;
};

export function createCurrentMarker(
  map: kakao.maps.Map,
  position: kakao.maps.LatLng
): CurrentMarkerHandle {
  const wrap = document.createElement("div");
  wrap.style.position = "relative";
  wrap.style.width = "36px";
  wrap.style.height = "36px";
  wrap.style.transform = "translate(-50%, -50%)";
  wrap.style.pointerEvents = "none";

  const halo = document.createElement("div");
  halo.style.position = "absolute";
  halo.style.left = "50%";
  halo.style.top = "50%";
  halo.style.width = "36px";
  halo.style.height = "36px";
  halo.style.borderRadius = "999px";
  halo.style.transform = "translate(-50%, -50%)";
  halo.style.background = "rgba(95, 213, 155, 0.25)";
  halo.style.boxShadow = "0 0 12px rgba(95, 213, 155, 0.45)";
  wrap.appendChild(halo);

  const dot = document.createElement("div");
  dot.style.position = "absolute";
  dot.style.left = "50%";
  dot.style.top = "50%";
  dot.style.width = "14px";
  dot.style.height = "14px";
  dot.style.borderRadius = "999px";
  dot.style.transform = "translate(-50%, -50%)";
  dot.style.background = "#5FD59B";
  dot.style.border = "2px solid #ffffff";
  wrap.appendChild(dot);

  const overlay = new kakao.maps.CustomOverlay({
    position,
    content: wrap,
    xAnchor: 0.5,
    yAnchor: 0.5,
    zIndex: 100,
  });
  overlay.setMap(map);

  return { overlay };
}

export function updateCurrentMarker(
  handle: CurrentMarkerHandle,
  position: kakao.maps.LatLng
) {
  handle.overlay.setPosition(position);
}

export function removeCurrentMarker(handle: CurrentMarkerHandle) {
  handle.overlay.setMap(null);
}
