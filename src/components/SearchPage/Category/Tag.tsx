interface TagProps {
  TagName: string;
  onClick: () => void;
  selected: boolean;
}

const Tag = ({ TagName, onClick, selected }: TagProps) => {
  return (
    <div className={`inline-block font-[PretendardVariable] font-normal text-base px-3 py-2 rounded-full cursor-pointer ${selected ? 'text-white bg-[#5FD59B]' : 'text-black bg-white/50 border border-[#F5F5F5]'}`} onClick={onClick}>
      {TagName}
    </div>
  );
};

export default Tag;
