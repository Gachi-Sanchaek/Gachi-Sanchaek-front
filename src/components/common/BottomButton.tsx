interface BottomButtonProps {
  buttons: { text: string; onClick: () => void; variant?: 'white' | 'green' }[];
}

const BottomButton = ({ buttons }: BottomButtonProps) => {
  const getButtonStyle = (variant: string = 'white') => {
    switch (variant) {
      case 'green':
        return 'bg-[#5FD59B] text-white hover:brightness-98';
      case 'white':
      default:
        return 'bg-white text-[#5FD59B] border border-[#5FD59B] hover:bg-gray-100/50';
    }
  };

  return (
    <div className='flex px-6 pt-2 gap-2 justify-center'>
      {buttons.length > 0 &&
        buttons.map(({ text, onClick, variant }, idx) => (
          <button type='button' key={idx} className={`w-full px-4 py-2 rounded-[10px] cursor-pointer font-[PretendardVariable] font-semibold text-base ${getButtonStyle(variant)}`} onClick={onClick}>
            {text}
          </button>
        ))}
    </div>
  );
};

export default BottomButton;
