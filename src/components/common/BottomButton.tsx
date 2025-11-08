interface BottomButtonProps {
  buttons: {
    text: string;
    onClick: () => void;
    variant?: 'white' | 'green';
    disabled?: boolean;
  }[];
}

const BottomButton = ({ buttons }: BottomButtonProps) => {
  const getButtonStyle = (variant: string = 'white', disabled?: boolean) => {
    if (disabled) return 'bg-[#F5F5F5] text-white cursor-not-allowed';

    switch (variant) {
      case 'green':
        return 'bg-[#5FD59B] text-white hover:brightness-98';
      case 'white':
      default:
        return 'bg-white text-[#5FD59B] border border-[#5FD59B] hover:bg-gray-100/50';
    }
  };

  return (
    <div className='relative w-full'>
      <div className='absolute bottom-0 left-0 w-full h-[70px] bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)]'></div>
      <div className='relative flex items-center h-[70px] px-6 gap-2 justify-center'>
        {buttons.length > 0 &&
          buttons.map(({ text, onClick, variant, disabled }, idx) => (
            <button type='button' key={idx} onClick={onClick} disabled={disabled} className={`w-full px-4 py-3 rounded-[8px] cursor-pointer font-[PretendardVariable] font-semibold text-[16px] text-base ${getButtonStyle(variant, disabled)}`}>
              {text}
            </button>
          ))}
      </div>
    </div>
  );
};

export default BottomButton;
