import QRScanner from '../components/WalkAuth/QrScanner';

function QRAuthPage() {
  return (
    <div className='h-screen flex flex-col items-center justify-center bg-black'>
      <QRScanner />
    </div>
  );
}

export default QRAuthPage;
