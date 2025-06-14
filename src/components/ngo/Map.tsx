
import React from 'react';
import GoogleMap from '@/components/maps/GoogleMap';

interface MapProps {
  className?: string;
  height?: string;
  pickupLocation?: { lat: number; lng: number; address?: string };
  dropoffLocation?: { lat: number; lng: number; address?: string };
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const Map: React.FC<MapProps> = ({ className, height = "h-64", ...props }) => {
  return <GoogleMap className={className} height={height} {...props} />;
};

export default Map;
