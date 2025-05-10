
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import LoadingAnimation from '@/components/LoadingAnimation';
import SdgBadge from '@/components/SdgBadge';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to user selection screen after a delay
    const timer = setTimeout(() => {
      navigate('/select-role');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 screen-fade-in">
      <div className="flex-1 flex items-center justify-center">
        <Logo size="lg" showTagline={true} />
      </div>
      
      <div className="mb-16 space-y-6">
        <SdgBadge />
        <LoadingAnimation />
      </div>
    </div>
  );
};

export default SplashScreen;
