
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Star, 
  MapPin, 
  Truck, 
  Check,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import NgoLayout from '@/components/ngo/NgoLayout';

const PickupAssignment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  
  // Mock donation data
  const donation = {
    id: id,
    title: 'Fresh Vegetables',
    address: '123 Main St, Downtown',
    pickupTime: '10:00 AM - 2:00 PM, May 10, 2025'
  };
  
  // Mock available drivers
  const availableDrivers = [
    {
      id: 'driver1',
      name: 'Michael Johnson',
      distance: '1.2 km away',
      rating: 4.8,
      totalDeliveries: 156,
      available: true
    },
    {
      id: 'driver2',
      name: 'Sarah Williams',
      distance: '2.5 km away',
      rating: 4.9,
      totalDeliveries: 243,
      available: true
    },
    {
      id: 'driver3',
      name: 'Robert Davis',
      distance: '0.8 km away',
      rating: 4.6,
      totalDeliveries: 89,
      available: true
    },
    {
      id: 'driver4',
      name: 'Emily Taylor',
      distance: '3.1 km away',
      rating: 4.7,
      totalDeliveries: 124,
      available: false
    }
  ];

  const handleAssign = () => {
    if (!selectedDriver) {
      toast({
        title: "Selection Required",
        description: "Please select a delivery person to assign the pickup.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Pickup Assigned",
      description: "Delivery person has been notified of the pickup."
    });
    
    navigate('/ngo/active-pickups');
  };

  const DriverCard = ({ driver }: { driver: typeof availableDrivers[0] }) => (
    <button
      key={driver.id}
      className={`w-full text-left p-4 border rounded-lg mb-3 ${
        selectedDriver === driver.id 
          ? 'bg-secondary/5 border-secondary' 
          : 'bg-white hover:bg-gray-50'
      } ${!driver.available ? 'opacity-50' : ''}`}
      onClick={() => driver.available && setSelectedDriver(driver.id)}
      disabled={!driver.available}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="font-medium">{driver.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
              <span>{driver.rating} • {driver.totalDeliveries} deliveries</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{driver.distance}</span>
        </div>
      </div>
      
      {selectedDriver === driver.id && (
        <div className="mt-3 pt-3 border-t flex justify-end">
          <span className="text-xs text-secondary flex items-center">
            <Check className="h-3.5 w-3.5 mr-1" />
            Selected for pickup
          </span>
        </div>
      )}
    </button>
  );

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
          <h1 className="text-xl font-semibold">Assign Pickup</h1>
        </div>
        
        <div className="bg-white rounded-lg border p-4 mb-4">
          <h2 className="font-medium mb-1">{donation.title}</h2>
          <p className="text-sm text-muted-foreground flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {donation.address}
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <Truck className="h-3.5 w-3.5 mr-1" />
            Pickup: {donation.pickupTime}
          </p>
        </div>
        
        <div className="mb-5">
          <h2 className="text-lg font-medium mb-3">Available Delivery Personnel</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-9"
            />
          </div>
          
          {availableDrivers.map(driver => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleAssign}
          disabled={!selectedDriver}
        >
          Assign Pickup
        </Button>
      </div>
    </NgoLayout>
  );
};

export default PickupAssignment;
