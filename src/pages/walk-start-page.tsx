import { useNavigate } from "react-router-dom";
import BottomButton from "../components/common/BottomButton";
import Category from "../components/SearchPage/Category/Category";
import MapView from "../components/WalkPage/MapView";
export default function WalkStartPage() {
  const navigate = useNavigate();

  return (
    <>
      <Category />

      <div className="w-full" style={{ height: "calc(100vh - 124px)" }}>
        <MapView />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
        <BottomButton
          buttons={[
            {
              text: "코스 추천 받기",
              variant: "white",
              onClick: () => navigate("/walk"),
            },
            { text: "바로 산책 시작", variant: "green", onClick: () => {} },
          ]}
        />
      </div>
    </>
  );
}
