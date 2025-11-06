import MapView from "../components/WalkPage/MapView";
export default function WalkingPage() {
  return (
    <>
      <div className="w-full" style={{ height: "calc(100vh - 48px - 230px)" }}>
        <MapView />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 ">
        <div className="w-[393px] h-[238px] relative overflow-hidden rounded-tr-xl bg-white mx-auto font-[PretendardVariable]"></div>
        <div></div>
      </div>
    </>
  );
}
