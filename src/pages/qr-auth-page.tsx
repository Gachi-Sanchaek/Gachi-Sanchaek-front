import { useEffect, useState } from 'react';
import QrScannner from '../components/WalkAuth/QRScanner';
import Close from '/src/assets/close-white.svg';
import { WalkStateStore } from '../store/WalkStateStore';
import Modal from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { postQrAuth } from '../apis/walk-auth';

function QRAuthPage() {
  const [result, setResult] = useState('');
  const [showCloseModal, setshowCloseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { walkState, setWalkState } = WalkStateStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQrAuth = async () => {
      try {
        const data = await postQrAuth(result);
        if (data.success) {
          setShowSuccessModal(true);
          setWalkState('walk');
        } else {
          setShowErrorModal(true);
        }
      } catch (e) {
        console.error('qr-auth error', e);
        setShowErrorModal(true);
      }
    };

    if (result) {
      fetchQrAuth();
    }
  }, [result, setWalkState]);

  const handleConfirm = () => {
    if (walkState === 'stop') {
      navigate(-1);
    } else if (walkState === 'walk') {
      navigate('/'); // 완료페이지로 이동
    }
  };

  const handleNavigateSuccess = () => {
    if (walkState === 'stop') {
      navigate('/'); // 완료페이지로 이동
    } else if (walkState === 'walk') {
      navigate('/'); //산책 추적 페이지로 이동
    }
  };

  return (
    <div className='relative h-screen flex flex-col items-center justify-center bg-black'>
      <button type='button' className='absolute top-10 right-6 cursor-pointer p-1' onClick={() => setshowCloseModal(true)}>
        <img src={Close} alt='close' />
      </button>
      <QrScannner setResult={setResult} />
      <p className='text-white font-[pretendardVariable] text-base font-normal pt-6'>QR 코드를 사각형 안에 맞춰주세요.</p>

      {showCloseModal && (
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
                setshowCloseModal(false);
              },
            },
            { variant: 'green', text: '확인', onClick: () => handleConfirm() },
          ]}
        />
      )}

      {showSuccessModal && (
        <Modal
          title='QR 인증 성공!'
          buttons={[
            {
              variant: 'green',
              text: '확인',
              onClick: () => handleNavigateSuccess(),
            },
          ]}
        />
      )}

      {showErrorModal && (
        <Modal
          title={
            <>
              인증이 실패했습니다. <br />
              다시 찍어주세요.
            </>
          }
          buttons={[
            {
              variant: 'gray',
              text: '산책 종료',
              onClick: () => {
                navigate('/');
              },
            },
            {
              variant: 'green',
              text: '다시 찍기',
              onClick: () => {
                location.reload();
              },
            },
          ]}
        />
      )}
    </div>
  );
}

export default QRAuthPage;
