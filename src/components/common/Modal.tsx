type ModalButton = {
  text: string;
  onClick: () => void;
  variant?: 'gray' | 'green';
};

interface ModalProps {
  title: string;
  buttons?: ModalButton[];
}

const Modal = ({ title, buttons = [] }: ModalProps) => {
  const getButtonStyle = (variant: string = 'gray') => {
    switch (variant) {
      case 'green':
        return 'bg-[#5FD59B] text-white hover:brightness-110';
      case 'gray':
      default:
        return 'bg-[#E0E0E0] text-white hover:bg-gray-300';
    }
  };
  return (
    <div role='dialog' aria-modal='true' className='fixed inset-0 flex items-center justify-center bg-black/40 z-[1000] p-20'>
      <div className='w-full max-w-[480px] px-8 py-6 bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)] flex flex-col gap-6'>
        <div className='w-full flex flex-col items-center gap-5 text-center'>
          <h2 className='text-black text-base font-normal select-none font-["PretendardVariable"]'>{title}</h2>

          {buttons.length > 0 && (
            <div className='flex w-full gap-2 '>
              {buttons.map(({ text, onClick, variant }, idx) => (
                <button key={idx} onClick={onClick} className={`w-full px-4 py-2 rounded-[10px] cursor-pointer ${getButtonStyle(variant)} `}>
                  <span className='text-base font-bold font-["PretendardVariable"]'>{text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
