import { useEffect, useState } from 'react';
import QrScannner from '../components/WalkAuth/QRScanner';
import Close from '/src/assets/close-white.svg';
import Modal from '../components/common/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { postQrAuth } from '../apis/walk-auth';
import { patchWalkFinish } from '../apis/walk';

function QRAuthPage() {
  const [qrResult, setQrResult] = useState('');
  const [showCloseModal, setshowCloseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const walkId = Number(localStorage.getItem('walkId'));
  const [isFirstAuth, setIsFirstAuth] = useState(true);
  const loc = useLocation();

  useEffect(() => {
    const fetchQrAuth = async () => {
      try {
        const data = await postQrAuth({
          walkId,
          qrToken: qrResult,
        });
        if (data.data.verified) {
          setIsFirstAuth(data.data.message.includes('1'));
          setShowSuccessModal(true);
        } else {
          setShowErrorModal(true);
        }
      } catch (e) {
        console.error('qr-auth error', e);
        setShowErrorModal(true);
      }
    };

    if (qrResult && walkId) {
      fetchQrAuth();
    }
  }, [qrResult, walkId]);

  const handleQuit = () => {
    // 1회차 QR일 때
    if (isFirstAuth) {
      navigate(-1);
    }
    // 2회차 QR일 때
    else {
      navigate('/');
    }
  };

  const handleNavigateSuccess = async () => {
    // 1회차 QR일 때 -> /walk/realtime
    if (isFirstAuth) {
      navigate('/walk/realtime');
    }
    // 2회차 QR일 때 -> /walk/end api -> finish page routing
    else {
      // 라우팅 상태로 전달받은 값 가져오기
      const totalDistance = loc.state.totalDistance;
      const totalMinutes = loc.state.totalMinutes;

      try {
        const data = await patchWalkFinish({
          walkId,
          totalDistance,
          totalMinutes,
        });

        if (data.status === 200) {
          // 완료페이지로 이동
          localStorage.removeItem('walkId');
          navigate('/end', {
            state: { ...data.data },
          });
        } else {
          alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
        }
      } catch (e) {
        console.error('walk finish error', e);
        alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div className='relative h-screen flex flex-col items-center justify-center bg-black'>
      <button type='button' className='absolute top-10 right-6 cursor-pointer p-1' onClick={() => setshowCloseModal(true)}>
        <img src={Close} alt='close' />
      </button>
      <QrScannner setResult={setQrResult} />
      <p className='text-white font-[pretendardVariable] text-base font-normal pt-6'>QR 코드를 사각형 안에 맞춰주세요.</p>

      {showCloseModal && (
        <Modal
          title={
            isFirstAuth ? (
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
            { variant: 'green', text: '확인', onClick: () => handleQuit() },
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
          title='인증을 실패했습니다...'
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
                setShowErrorModal(false);
              },
            },
          ]}
        />
      )}
    </div>
  );
}

export default QRAuthPage;
