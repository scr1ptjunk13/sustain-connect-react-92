
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone,
  Clock,
  Navigation,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeliveryLayout from '@/components/delivery/DeliveryLayout';
import GoogleMap from '@/components/maps/GoogleMap';
import { useRealtimeDeliveries } from '@/hooks/useRealtimeDeliveries';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/hooks/use-toast';

const LiveTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateDeliveryLocation } = useRealtimeDeliveries();
  const { latitude, longitude, loading: locationLoading } = useGeolocation(true, true);
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Mock delivery data - in real app would come from API
  const delivery = {
    id,
    title: 'Fresh Vegetables',
    pickupAddress: '123 Main St, Downtown',
    pickupLat: 37.7749,
    pickupLng: -122.4194,
    dropoffAddress: 'Food Bank, 789 Charity Ave',
    dropoffLat: 37.7849,
    dropoffLng: -122.4094,
    status: 'in_progress',
    ngoContact: {
      name: 'Food Bank Coordinator',
      phone: '+1 (555) 987-6543'
    }
  };

  // Update location every 30 seconds when tracking is active
  useEffect(() => {
    if (latitude && longitude && delivery.status === 'in_progress') {
      const interval = setInterval(() => {
        updateDeliveryLocation(delivery.id!, latitude, longitude, 10); // Mock 10 min ETA
      }, 30000);
      
      setUpdateInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [latitude, longitude, delivery.status, delivery.id, updateDeliveryLocation]);

  const handleManualLocationUpdate = () => {
    if (latitude && longitude) {
      updateDeliveryLocation(delivery.id!, latitude, longitude);
      toast({
        title: "Location Updated",
        description: "Your current location has been shared with the NGO"
      });
    }
  };

  const handleCallNGO = () => {
    toast({
      title: "Calling NGO",
      description: delivery.ngoContact.phone
    });
  };

  return (
    <DeliveryLayout>
      <div className="py-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Live Tracking</h1>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="mr-2">
                <Zap className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <span className="text-sm text-muted-foreground">
                Location updates every 30s
              </span>
            </div>
          </div>
        </div>

        <GoogleMap
          height="h-64"
          className="mb-4"
          pickupLocation={{ lat: delivery.pickupLat, lng: delivery.pickupLng }}
          dropoffLocation={{ lat: delivery.dropoffLat, lng: delivery.dropoffLng }}
          currentLocation={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
          showRoute={true}
        />

        <div className="bg-white rounded-lg border mb-4">
          <div className="p-4">
            <h2 className="font-medium mb-3">{delivery.title}</h2>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pickup Complete</p>
                  <p className="text-xs text-muted-foreground">{delivery.pickupAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Delivering to</p>
                  <p className="text-xs text-muted-foreground">{delivery.dropoffAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border mb-4">
          <div className="p-4">
            <h3 className="font-medium mb-3">Location Status</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">GPS Status</span>
                <Badge variant={latitude && longitude ? "default" : "secondary"}>
                  {latitude && longitude ? "Active" : "Searching..."}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Auto Updates</span>
                <Badge variant={updateInterval ? "default" : "secondary"}>
                  {updateInterval ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              {latitude && longitude && (
                <div className="text-xs text-muted-foreground mt-2">
                  Current: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={handleManualLocationUpdate}
            disabled={!latitude || !longitude || locationLoading}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Update Location Now
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={handleCallNGO}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call {delivery.ngoContact.name}
          </Button>
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default LiveTracking;
