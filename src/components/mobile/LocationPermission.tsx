
import React, { useState } from 'react';
import { MapPin, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationPermissionProps {
  onPermissionGranted: () => void;
  onDismiss: () => void;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({ 
  onPermissionGranted, 
  onDismiss 
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { getCurrentLocation } = useGeolocation();

  const requestPermission = async () => {
    setIsRequesting(true);
    
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            onPermissionGranted();
          },
          (error) => {
            console.error('Geolocation error:', error);
            setIsRequesting(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      }
    } catch (error) {
      console.error('Error requesting location:', error);
      setIsRequesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Location Access</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>We need your location to:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside ml-2">
                  <li>Show nearby donations</li>
                  <li>Calculate delivery distances</li>
                  <li>Provide navigation assistance</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onDismiss}
                className="flex-1"
              >
                Not Now
              </Button>
              <Button
                onClick={requestPermission}
                disabled={isRequesting}
                className="flex-1"
              >
                {isRequesting ? 'Requesting...' : 'Allow Location'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPermission;
