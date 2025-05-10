
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Map from '@/components/ngo/Map';

const NavigationScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [arrived, setArrived] = useState(false);
  
  // Mock delivery data
  const delivery = {
    id,
    title: 'Fresh Vegetables',
    pickupAddress: '123 Main St, Downtown',
    pickupContact: {
      name: 'John Doe',
      phone: '+1 (555) 123-4567'
    },
    dropoffAddress: 'Food Bank, 789 Charity Ave',
    dropoffContact: {
      name: 'Food Bank Coordinator',
      phone: '+1 (555) 987-6543'
    },
    eta: '5 min',
    nextDirection: 'Turn right onto Main Street',
    distance: '0.5 miles to destination'
  };
  
  const handleCall = (phone: string) => {
    toast({
      title: "Calling",
      description: phone
    });
  };
  
  const handleMarkArrival = () => {
    setArrived(true);
    toast({
      title: "Arrived at Pickup",
      description: "Please collect the donation and confirm pickup."
    });
    
    // In a real app, this would update the status in the database
    // and then redirect after a short delay
    setTimeout(() => {
      navigate(`/delivery/pickup-confirmation/${id}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 flex items-center bg-background border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 mr-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Navigation to Pickup</h1>
          <p className="text-sm text-muted-foreground">
            ETA: {delivery.eta}
          </p>
        </div>
      </div>
      
      <div className="relative flex-1">
        <Map height="h-full" />
        
        <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{delivery.title}</p>
                <p className="text-sm text-muted-foreground">{delivery.pickupAddress}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleCall(delivery.pickupContact.phone)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-secondary/5 rounded-lg p-3 mb-3">
            <div className="flex items-center">
              <ChevronRight className="h-5 w-5 text-secondary mr-2" />
              <div>
                <p className="font-medium">{delivery.nextDirection}</p>
                <p className="text-sm text-muted-foreground">{delivery.distance}</p>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleMarkArrival}
            disabled={arrived}
          >
            {arrived ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Arrived at Pickup
              </>
            ) : (
              "Mark Arrival at Pickup"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavigationScreen;
