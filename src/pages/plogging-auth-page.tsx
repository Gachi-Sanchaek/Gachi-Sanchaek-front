import { useEffect, useRef, useState } from 'react';
import Close from '/src/assets/close-white.svg';
import Modal from '../components/common/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { postPloggingAuth } from '../apis/walk-auth';
import { patchWalkFinish } from '../apis/walk';
import SirenBonggong from '/src/assets/images/siren_bonggong.svg';

export default function PloggingAuthPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [showCloseModal, setshowCloseModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAiDetecting, setIsAiDetecting] = useState(false);
  const navigate = useNavigate();
  const walkId = localStorage.getItem('walkId');
  const loc = useLocation();

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // 카메라 시작
  useEffect(() => {
    // 로컬 변수에 ref 값을 복사하고 startCamera에서 설정되면 업데이트
    let mountedVideo = videoRef.current;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // 후면 카메라
          audio: false,
        });
        // 스트림 시작
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mountedVideo = videoRef.current;
        }
      } catch (err) {
        console.error('카메라 접근 실패:', err);
        alert('카메라 접근에 실패했습니다. 접근 권한을 확인해주세요.');
      }
    };

    startCamera();

    // 스트림 종료
    return () => {
      if (mountedVideo?.srcObject) {
        const tracks = (mountedVideo.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // 캡처 버튼 클릭 시
  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return;

    // 캔버스에 비디오 화면 복사
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { videoWidth, videoHeight } = videoRef.current;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    // File 생성
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'capture.jpeg', { type: 'image/jpeg' });
      setCapturedFile(file);

      // 미리보기용 URL 생성
      const previewURL = URL.createObjectURL(file);
      setCapturedImage(previewURL);

      if (previewURL) {
        setShowSubmitModal(true);
      }
    }, 'image/jpeg');
  };

  const handleSubmit = async () => {
    if (capturedFile && walkId) {
      setIsAiDetecting(true);

      try {
        const data = await postPloggingAuth({
          walkId,
          image: capturedFile,
        });

        if (data.data.verified) {
          setShowSuccessModal(true);
        } else {
          alert(data.data.message);
          location.reload();
        }
      } catch (e) {
        alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
        console.error('plogging auth error', e);
      }
    }

    setShowSubmitModal(false);
    setIsAiDetecting(false);
  };

  const handleSuccess = async () => {
    // 라우팅 상태로 전달받은 값 가져오기
    const totalDistance = loc.state.totalDistance;
    const totalSeconds = loc.state.totalSeconds;

    try {
      const data = await patchWalkFinish({
        walkId: Number(walkId),
        totalDistance,
        totalSeconds,
      });

      if (data.status === 200) {
        localStorage.removeItem('walkId');
        navigate('/end', {
          state: { ...data.data },
        }); //종료페이지로 이동
      } else {
        alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (e) {
      alert('접속이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
      console.error('plogging auth error', e);
    }
  };

  return (
    <div className='relative w-full h-[100dvh] flex flex-col justify-center items-center gap-1 bg-black'>
      <button type='button' className='absolute top-10 right-6 cursor-pointer p-1' onClick={() => setshowCloseModal(true)}>
        <img src={Close} alt='close' />
      </button>
      {/* 카메라 미러링 */}
      <video ref={videoRef} autoPlay playsInline muted controls={false} disablePictureInPicture controlsList='nodownload nofullscreen noremoteplayback' className='w-full max-w-[400px] object-cover aspect-square px-5 pointer-events-none' />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <p className='text-white font-[pretendardVariable] text-base font-normal text-center'>
        쓰레기를 담은 봉투가 잘 보이게, <br /> 사각형 안에 맞춰주세요.
      </p>

      {/* 캡처 버튼 */}
      <div className='absolute bottom-7 border-3 border-white rounded-full bg-transparent w-18 h-18 flex justify-center items-center'>
        <button onClick={handleCapture} className='w-15 h-15 bg-white text-white rounded-full cursor-pointer active:w-13 active:h-13' />
      </div>

      {showCloseModal && (
        <Modal
          title={
            <>
              산책을 그냥 종료하면 포인트가 적립되지 않아요. <br /> 그래도 종료하시겠어요?
            </>
          }
          buttons={[
            {
              variant: 'gray',
              text: '취소',
              onClick: () => {
                setshowCloseModal(false);
              },
            },
            {
              variant: 'green',
              text: '확인',
              onClick: () => {
                navigate('/');
              },
            },
          ]}
        />
      )}

      {showSubmitModal && capturedImage && !isAiDetecting && (
        <Modal
          title={
            <>
              <img src={capturedImage} alt='플로깅 인증사진' />
              <p className='pt-3'>제출하시겠습니까?</p>
            </>
          }
          buttons={[
            { variant: 'gray', text: '다시찍기', onClick: () => setShowSubmitModal(false) },
            {
              variant: 'green',
              text: '제출하기',
              onClick: handleSubmit,
            },
          ]}
        />
      )}
      {showSuccessModal && (
        <Modal
          title={
            <>
              인증이 완료되었습니다! <br /> 산책을 종료합니다.
            </>
          }
          buttons={[
            {
              variant: 'green',
              text: '확인',
              onClick: () => handleSuccess(),
            },
          ]}
        />
      )}
      {isAiDetecting && (
        <Modal
          title={
            <div className='flex flex-col justify-center items-center'>
              <img src={SirenBonggong} alt='ai detecting' />
              <p className='pt-3'>AI가 검증하고 있어요!</p>
            </div>
          }
        />
      )}
    </div>
  );
}
