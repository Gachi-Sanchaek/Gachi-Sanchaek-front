import Location from '/src/assets/location.svg';
import Phone from '/src/assets/phone.svg';

interface ListCardProps {
  location: string;
  address?: string;
  phoneNum?: string;
}

const ListCard = ({ location, address, phoneNum }: ListCardProps) => {
  return (
    <div className='flex flex-col gap-0.5 px-6 py-3 border-b border-[#F5F5F5]'>
      <p className='font-[PretendardVariable] font-semibold text-[14px]'>{location}</p>
      <div className='flex gap-1'>
        <img src={Location} alt='주소' />
        <p className='font-[PretendardVariable] font-normal text-[14px]'>{address ? address : '-'}</p>
      </div>
      <div className='flex gap-1'>
        <img src={Phone} alt='연락처' />
        <p className='font-[PretendardVariable] font-normal text-[14px]'>{phoneNum ? phoneNum : '-'}</p>
      </div>
    </div>
  );
};

export default ListCard;
