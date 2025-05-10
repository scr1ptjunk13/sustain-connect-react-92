
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock,
  Phone,
  CircleDollarSign,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DeliveryLayout from '@/components/delivery/DeliveryLayout';
import Map from '@/components/ngo/Map';

const DeliveryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock delivery data - would come from API in real app
  const delivery = {
    id,
    title: 'Fresh Vegetables',
    description: '5kg of assorted fresh vegetables including carrots, tomatoes, and lettuce',
    pickupAddress: '123 Main St, Downtown',
    pickupContact: {
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      instructions: 'Ring doorbell, items will be at the front door'
    },
    dropoffAddress: 'Food Bank, 789 Charity Ave',
    dropoffContact: {
      name: 'Food Bank Coordinator',
      phone: '+1 (555) 987-6543',
      instructions: 'Deliver to loading dock in the back'
    },
    distance: '3.2 km',
    estimatedTime: '15 min',
    compensation: '$8.50',
    weight: '5 kg',
    size: 'Medium',
    expires: 'May 12, 2025'
  };
  
  const handleAcceptDelivery = () => {
    toast({
      title: "Delivery Accepted",
      description: "You can now proceed to pickup the donation."
    });
    
    navigate(`/delivery/navigation/${id}`);
  };
  
  const handleCall = (name: string, phone: string) => {
    toast({
      title: `Calling ${name}`,
      description: phone,
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
          <h1 className="text-xl font-semibold">Delivery Details</h1>
        </div>
        
        <Map height="h-40" className="mb-4" />
        
        <div className="bg-white rounded-lg border overflow-hidden mb-4">
          <div className="p-4">
            <h2 className="font-medium text-lg">{delivery.title}</h2>
            <p className="text-sm text-muted-foreground">{delivery.description}</p>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{delivery.estimatedTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{delivery.distance}</span>
              </div>
              <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{delivery.compensation}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Pickup Information</h3>
              <p className="text-sm flex items-start mb-2">
                <MapPin className="h-4 w-4 mr-2 shrink-0 text-primary" />
                {delivery.pickupAddress}
              </p>
              
              <h4 className="text-sm font-medium mt-3 mb-1">Contact Person</h4>
              <p className="text-sm">{delivery.pickupContact.name}</p>
              
              <div className="flex items-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => handleCall(delivery.pickupContact.name, delivery.pickupContact.phone)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call Donor
                </Button>
              </div>
              
              <h4 className="text-sm font-medium mt-3 mb-1">Special Instructions</h4>
              <p className="text-sm text-muted-foreground">{delivery.pickupContact.instructions}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Dropoff Information</h3>
              <p className="text-sm flex items-start mb-2">
                <MapPin className="h-4 w-4 mr-2 shrink-0 text-primary" />
                {delivery.dropoffAddress}
              </p>
              
              <h4 className="text-sm font-medium mt-3 mb-1">Contact Person</h4>
              <p className="text-sm">{delivery.dropoffContact.name}</p>
              
              <div className="flex items-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => handleCall(delivery.dropoffContact.name, delivery.dropoffContact.phone)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call NGO
                </Button>
              </div>
              
              <h4 className="text-sm font-medium mt-3 mb-1">Special Instructions</h4>
              <p className="text-sm text-muted-foreground">{delivery.dropoffContact.instructions}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Donation Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-muted-foreground">Weight:</p>
                <p>{delivery.weight}</p>
                <p className="text-muted-foreground">Size:</p>
                <p>{delivery.size}</p>
                <p className="text-muted-foreground">Expires:</p>
                <p>{delivery.expires}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200 mb-4">
          <Info className="h-5 w-5 mr-3 text-amber-500" />
          <p className="text-sm text-amber-800">
            By accepting, you confirm that you'll handle the food safely and deliver it promptly.
          </p>
        </div>
        
        <Button 
          className="w-full mb-4" 
          onClick={handleAcceptDelivery}
        >
          Accept Delivery
        </Button>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryDetails;
