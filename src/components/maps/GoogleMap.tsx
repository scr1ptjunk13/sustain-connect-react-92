
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GoogleMapProps {
  height?: string;
  className?: string;
  pickupLocation?: { lat: number; lng: number; address?: string };
  dropoffLocation?: { lat: number; lng: number; address?: string };
  currentLocation?: { lat: number; lng: number };
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  showRoute?: boolean;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  height = "h-64",
  className,
  pickupLocation,
  dropoffLocation,
  currentLocation,
  onLocationSelect,
  showRoute = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const { toast } = useToast();

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainer.current || !window.google) return;

      const defaultCenter = currentLocation || pickupLocation || { lat: 37.7749, lng: -122.4194 };
      
      map.current = new google.maps.Map(mapContainer.current, {
        center: defaultCenter,
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      setMapLoaded(true);
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [currentLocation, pickupLocation]);

  // Add markers and route when map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    const markers: google.maps.Marker[] = [];

    // Add pickup marker
    if (pickupLocation) {
      const pickupMarker = new google.maps.Marker({
        position: pickupLocation,
        map: map.current,
        title: 'Pickup Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#22c55e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });
      markers.push(pickupMarker);
    }

    // Add dropoff marker
    if (dropoffLocation) {
      const dropoffMarker = new google.maps.Marker({
        position: dropoffLocation,
        map: map.current,
        title: 'Dropoff Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });
      markers.push(dropoffMarker);
    }

    // Add current location marker
    if (currentLocation) {
      const currentMarker = new google.maps.Marker({
        position: currentLocation,
        map: map.current,
        title: 'Current Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        }
      });
      markers.push(currentMarker);
    }

    // Show route if requested
    if (showRoute && pickupLocation && dropoffLocation) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeWeight: 4,
        }
      });

      directionsRenderer.setMap(map.current);

      directionsService.route({
        origin: pickupLocation,
        destination: dropoffLocation,
        waypoints: currentLocation ? [{ location: currentLocation, stopover: false }] : [],
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
        }
      });
    }

    // Cleanup function
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [mapLoaded, pickupLocation, dropoffLocation, currentLocation, showRoute]);

  const searchAddress = async () => {
    if (!addressInput.trim() || !window.google) return;

    const geocoder = new google.maps.Geocoder();
    
    try {
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address: addressInput }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });

      if (result.length > 0) {
        const location = result[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = result[0].formatted_address;

        if (map.current) {
          map.current.setCenter({ lat, lng });
          map.current.setZoom(15);
        }

        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address });
        }

        toast({
          title: "Location Found",
          description: address
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find address",
        variant: "destructive"
      });
    }
  };

  // Fallback map display when Google Maps is not available
  if (!window.google && !mapLoaded) {
    return (
      <div className={`relative ${height} ${className || 'w-full'} bg-gray-100 rounded-lg overflow-hidden border`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-center text-gray-600 mb-4">
            Interactive map will appear here
            <br />
            <span className="text-xs">(Google Maps integration)</span>
          </p>
          
          {onLocationSelect && (
            <div className="w-full max-w-sm space-y-2">
              <Input
                placeholder="Enter address..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
              />
              <Button onClick={searchAddress} size="sm" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Search Address
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${height} ${className || 'w-full'} rounded-lg overflow-hidden border`}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {onLocationSelect && (
        <div className="absolute top-3 left-3 right-3 z-10">
          <div className="flex gap-2">
            <Input
              placeholder="Search address..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
              className="bg-white shadow-sm"
            />
            <Button onClick={searchAddress} size="sm">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
