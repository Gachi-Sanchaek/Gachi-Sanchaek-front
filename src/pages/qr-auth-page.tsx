import { useState } from 'react';
import QrScannner from '../components/WalkAuth/QRScanner';
import Close from '/src/assets/close-white.svg';
import { WalkStateStore } from '../store/WalkStateStore';
import Modal from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
// import Modal from '../components/common/Modal';

function QRAuthPage() {
  const [showModal, setShowModal] = useState(false);
  const { walkState } = WalkStateStore();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (walkState === 'stop') {
      navigate(-1);
    } else if (walkState === 'walk') {
      navigate('/'); // 완료페이지로 이동
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center bg-black'>
      <button type='button' className='text-white fixed top-10 right-6' onClick={() => setShowModal(true)}>
        <img src={Close} alt='close' />
      </button>
      <QrScannner />
      <p className='text-white font-[pretendardVariable] text-base font-normal pt-6'>QR 코드를 사각형 안에 맞춰주세요.</p>

      {showModal && (
        <Modal
          title={
            walkState === 'stop' ? (
              '산책 인증을 그만두시겠습니까?'
            ) : (
              <>
                산책을 그냥 종료하면 포인트가 적립되지 않아요. <br /> 그래도 종료하시겠어요?
              </>
            )
          }
          buttons={[
            {
              variant: 'gray',
              text: '취소',
              onClick: () => {
                setShowModal(false);
              },
            },
            { variant: 'green', text: '확인', onClick: () => handleNavigate() },
          ]}
        />
      )}
    </div>
  );
}

export default QRAuthPage;
