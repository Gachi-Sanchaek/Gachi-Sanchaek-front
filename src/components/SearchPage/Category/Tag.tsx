interface TagProps {
  TagName: '산책' | '동행 산책' | '유기견 산책' | '플로깅';
  onClick: () => void;
  selected: boolean;
}

const Tag = ({ TagName, onClick, selected }: TagProps) => {
  return (
    <div className={`inline-block whitespace-nowrap font-[PretendardVariable] font-normal text-base px-3 py-2 rounded-full cursor-pointer ${selected ? 'text-white bg-[#5FD59B]' : 'text-black bg-white/50 border border-[#F5F5F5]'}`} onClick={onClick}>
      {TagName}
    </div>
  );
};

export default Tag;
