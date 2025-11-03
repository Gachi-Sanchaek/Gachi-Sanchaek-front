import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import BottomButton from "../components/common/BottomButton";
import Category from "../components/SearchPage/Category/Category";
import MapView from "../components/WalkPage/MapView";
export default function WalkStartPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <Header hasArrow title="유기견 산책" titleColor="black" bgColor="white" />
      <div className="pt-8">
        <Category />
      </div>
      <div className="w-full" style={{ height: 810 }}>
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
    </div>
  );
}
