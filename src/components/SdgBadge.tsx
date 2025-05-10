
import React from 'react';

const SdgBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-2 bg-secondary-50 px-3 py-1.5 rounded-full">
      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-center text-white text-[10px] font-bold">
        11
      </div>
      <span className="text-xs font-medium text-secondary-600">SDG 11: Sustainable Cities</span>
    </div>
  );
};

export default SdgBadge;
