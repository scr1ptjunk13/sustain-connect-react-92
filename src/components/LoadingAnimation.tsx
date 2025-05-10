
import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-primary-300 animate-pulse-slow"></div>
      <div className="w-4 h-4 rounded-full bg-primary-500 animate-pulse-slow" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-4 h-4 rounded-full bg-secondary-300 animate-pulse-slow" style={{ animationDelay: '0.4s' }}></div>
      <div className="w-4 h-4 rounded-full bg-secondary-500 animate-pulse-slow" style={{ animationDelay: '0.6s' }}></div>
    </div>
  );
};

export default LoadingAnimation;
