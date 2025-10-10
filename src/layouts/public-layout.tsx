import Header from '../components/common/Header';

const PublicLayout = () => {
  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-[480px] min-h-screen bg-white '>
        <Header />
      </div>
    </div>
  );
};

export default PublicLayout;
