type RouteInfoCardProps = {
  title: string; //코스명
  minutes: number; //예상시간
};

export default function RouteInfoCard({ title, minutes }: RouteInfoCardProps) {
  return (
    <div
      className="p-[2px] rounded-lg bg-gradient-to-r from-[#5FD59B] to-[#FFEC8A] "
      style={{ boxShadow: "0px 0px 10px 0 rgba(95, 213, 155, 0.15)" }}
    >
      <div className="flex flex-col items-center gap-1 w-full rounded-[6px] bg-white px-3 py-4">
        {/* 제목 + 선 */}
        <div className="w-full pb-2 border-b border-[#5FD59B]">
          <p className="font-[PretendardVariable] text-base font-semibold text-center text-[#5fd59b]">
            {title}
          </p>
        </div>

        {/* 예상시간 */}
        <p className="font-[PretendardVariable] w-full text-sm font-semibold text-center text-[#5fd59b]">
          약 {minutes}분 소요
        </p>
      </div>
    </div>
  );
}
