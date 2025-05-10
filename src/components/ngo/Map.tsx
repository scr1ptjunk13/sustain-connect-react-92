
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  className?: string;
  height?: string;
}

const Map: React.FC<MapProps> = ({ className, height = "h-64" }) => {
  // This is a placeholder for an actual map implementation
  // In a real app, this would use a library like Mapbox or Google Maps
  
  return (
    <div className={`relative ${height} ${className || 'w-full'} bg-gray-100 rounded-lg overflow-hidden`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <MapPin className="h-8 w-8 text-secondary mb-2" />
        <p className="text-sm text-center text-muted-foreground">
          Map view would appear here
          <br />
          <span className="text-xs">(Requires Mapbox/Google Maps integration)</span>
        </p>
      </div>
    </div>
  );
};

export default Map;
