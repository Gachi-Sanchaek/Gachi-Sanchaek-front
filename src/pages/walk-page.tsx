import Header from "../components/common/Header";
import BottomButton from "../components/common/BottomButton";


export default function WalkPage() {
  return (
    <div>
      <Header hasArrow title="유기견 산책" titleColor="black" bgColor="white" />

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
        <BottomButton
          buttons={[
            { text: "코스 추천 받기", variant: "green", onClick: () => {} },
          ]}
        />
      </div>
    </div>
  );
}
