import { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import { QrOptions } from '../../constant/QrOptions';

export default function QrScannner() {
  const videoRef = useRef(null);

  const handleScan = (result: QrScanner.ScanResult) => {
    console.log(result.data);
  };

  useEffect(() => {
    const videoElem = videoRef.current;

    if (videoElem) {
      const qrScanner = new QrScanner(videoElem, (result) => handleScan(result), QrOptions);
      qrScanner.start();

      return () => qrScanner.destroy();
    }
  }, []);

  return <video ref={videoRef} style={{ width: '300px', height: '300px', objectFit: 'cover' }} autoPlay playsInline />;
}
