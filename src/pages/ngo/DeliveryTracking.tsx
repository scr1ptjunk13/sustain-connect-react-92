
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone,
  Clock,
  User,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NgoLayout from '@/components/ngo/NgoLayout';
import GoogleMap from '@/components/maps/GoogleMap';
import { useRealtimeDeliveries } from '@/hooks/useRealtimeDeliveries';
import { useToast } from '@/hooks/use-toast';

const DeliveryTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deliveries } = useRealtimeDeliveries();
  const [currentDelivery, setCurrentDelivery] = useState<any>(null);
  
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
    driver: {
      name: 'Michael Johnson',
      phone: '+1 (555) 987-6543',
      currentLat: 37.7799, // Mock current location
      currentLng: -122.4144
    },
    eta: '8 minutes'
  };

  useEffect(() => {
    // Find current delivery from real-time updates
    const realtimeDelivery = deliveries.find(d => d.id === id);
    if (realtimeDelivery) {
      setCurrentDelivery(realtimeDelivery);
    }
  }, [deliveries, id]);

  const handleCallDriver = () => {
    toast({
      title: "Calling Driver",
      description: delivery.driver.phone
    });
  };

  const currentLocation = currentDelivery?.current_location_lat && currentDelivery?.current_location_lng
    ? { lat: currentDelivery.current_location_lat, lng: currentDelivery.current_location_lng }
    : { lat: delivery.driver.currentLat, lng: delivery.driver.currentLng };

  return (
    <NgoLayout>
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
            <h1 className="text-xl font-semibold">Track Delivery</h1>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="mr-2">
                <Zap className="h-3 w-3 mr-1" />
                Live Tracking
              </Badge>
              <span className="text-sm text-muted-foreground">
                ETA: {currentDelivery?.eta_minutes || delivery.eta}
              </span>
            </div>
          </div>
        </div>

        <GoogleMap
          height="h-64"
          className="mb-4"
          pickupLocation={{ lat: delivery.pickupLat, lng: delivery.pickupLng }}
          dropoffLocation={{ lat: delivery.dropoffLat, lng: delivery.dropoffLng }}
          currentLocation={currentLocation}
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
                  <p className="text-sm font-medium">Picked up from</p>
                  <p className="text-xs text-muted-foreground">{delivery.pickupAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">En route to your location</p>
                  <p className="text-xs text-muted-foreground">{delivery.dropoffAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border mb-4">
          <div className="p-4">
            <h3 className="font-medium mb-3">Delivery Person</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">{delivery.driver.name}</p>
                  <p className="text-sm text-muted-foreground">Delivery in progress</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCallDriver}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Estimated Arrival</p>
              <p className="text-sm text-blue-700">
                Your delivery should arrive in approximately {currentDelivery?.eta_minutes || delivery.eta}. 
                You'll receive a notification when the driver arrives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </NgoLayout>
  );
};

export default DeliveryTracking;
