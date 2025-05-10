
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DeliveryLayout from '@/components/delivery/DeliveryLayout';
import DeliveryCard from '@/components/delivery/DeliveryCard';
import Map from '@/components/ngo/Map';

const AvailableDeliveries: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [compensationFilter, setCompensationFilter] = useState('all');
  const navigate = useNavigate();
  
  // Mock data - in a real app this would come from API
  const availableDeliveries = [
    {
      id: '123',
      title: 'Fresh Vegetables',
      pickupAddress: '123 Main St, Downtown',
      dropoffAddress: 'Food Bank, 789 Charity Ave',
      distance: '3.2 km',
      estimatedTime: '15 min',
      compensation: '$8.50'
    },
    {
      id: '456',
      title: 'Cooked Pasta',
      pickupAddress: '456 Oak Ave, Midtown',
      dropoffAddress: 'Community Center, 101 Help St',
      distance: '4.5 km',
      estimatedTime: '20 min',
      compensation: '$10.00'
    },
    {
      id: '789',
      title: 'Bakery Items',
      pickupAddress: '789 Pine St, Uptown',
      dropoffAddress: 'Homeless Shelter, 202 Care Rd',
      distance: '2.8 km',
      estimatedTime: '12 min',
      compensation: '$7.00'
    },
    {
      id: '101',
      title: 'Canned Goods',
      pickupAddress: '101 Cedar Rd, Westside',
      dropoffAddress: 'Senior Center, 303 Elder Blvd',
      distance: '5.5 km',
      estimatedTime: '25 min',
      compensation: '$12.00'
    }
  ];
  
  const handleAcceptDelivery = (id: string) => {
    navigate(`/delivery/details/${id}`);
  };

  return (
    <DeliveryLayout title="Available Deliveries">
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deliveries..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Select 
            onValueChange={setDistanceFilter} 
            defaultValue="all"
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Distance</SelectItem>
              <SelectItem value="near">Under 3 km</SelectItem>
              <SelectItem value="medium">3-5 km</SelectItem>
              <SelectItem value="far">Over 5 km</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            onValueChange={setCompensationFilter} 
            defaultValue="all"
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Compensation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Amount</SelectItem>
              <SelectItem value="low">Under $8</SelectItem>
              <SelectItem value="medium">$8-$10</SelectItem>
              <SelectItem value="high">Over $10</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <Map height="h-40" className="mb-4" />
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-3">Available Deliveries ({availableDeliveries.length})</h2>
          
          {availableDeliveries.map(delivery => (
            <DeliveryCard
              key={delivery.id}
              id={delivery.id}
              title={delivery.title}
              pickupAddress={delivery.pickupAddress}
              dropoffAddress={delivery.dropoffAddress}
              distance={delivery.distance}
              estimatedTime={delivery.estimatedTime}
              compensation={delivery.compensation}
              onAccept={() => handleAcceptDelivery(delivery.id)}
            />
          ))}
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default AvailableDeliveries;
