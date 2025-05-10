
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center shadow-lg`}>
        <div className="absolute inset-0 rounded-full border-4 border-white/40 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-secondary-300 to-secondary-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">SC</span>
          </div>
        </div>
      </div>
      {showTagline && (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
            SustainConnect
          </h2>
          <p className="text-sm text-gray-600 mt-1">Connecting resources for sustainable communities</p>
        </div>
      )}
    </div>
  );
};

export default Logo;
