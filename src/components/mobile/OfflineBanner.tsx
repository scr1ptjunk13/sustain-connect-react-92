
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const OfflineBanner: React.FC = () => {
  const { isOnline } = usePWA();
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    if (isOnline && showReconnected === false) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-3 text-center text-white text-sm ${
      isOnline ? 'bg-green-600' : 'bg-red-600'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        <span>
          {isOnline ? 'Back online' : 'You are offline'}
        </span>
      </div>
    </div>
  );
};

export default OfflineBanner;
