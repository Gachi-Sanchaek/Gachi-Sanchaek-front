import { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import { QrOptions } from '../../constant/QrOptions';

interface QrScannerProps {
  setResult: React.Dispatch<React.SetStateAction<string>>;
}

const QrScannner = ({ setResult }: QrScannerProps) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElem = videoRef.current;

    const handleScan = (result: QrScanner.ScanResult) => {
      setResult(result.data);
    };

    if (videoElem) {
      const qrScanner = new QrScanner(videoElem, (result) => handleScan(result), QrOptions);
      qrScanner.start();

      return () => qrScanner.destroy();
    }
  }, [setResult]);

  return <video ref={videoRef} style={{ width: '300px', height: '300px', objectFit: 'cover' }} autoPlay playsInline />;
};

export default QrScannner;
