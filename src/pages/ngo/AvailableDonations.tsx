
import React, { useState } from 'react';
import { Filter, MapPin, Search, List, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NgoLayout from '@/components/ngo/NgoLayout';
import DonationCard from '@/components/ngo/DonationCard';
import Map from '@/components/ngo/Map';

const AvailableDonations: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [foodTypeFilter, setFoodTypeFilter] = useState<string>("all");
  const [distanceFilter, setDistanceFilter] = useState<string>("all");
  
  // Mock data - in a real app this would come from API
  const availableDonations = [
    {
      id: '123',
      title: 'Fresh Vegetables',
      quantity: '5 kg',
      foodType: 'Vegetables',
      distance: '0.8 km away',
      expiryTime: 'in 2 days',
      address: '123 Main St, Downtown',
      urgent: false
    },
    {
      id: '456',
      title: 'Cooked Pasta',
      quantity: '3 kg',
      foodType: 'Prepared Food',
      distance: '1.2 km away',
      expiryTime: 'Today',
      address: '456 Oak Ave, Midtown',
      urgent: true
    },
    {
      id: '789',
      title: 'Bread and Pastries',
      quantity: '2 kg',
      foodType: 'Bakery',
      distance: '1.5 km away',
      expiryTime: 'Tomorrow',
      address: '789 Pine St, Uptown',
      urgent: false
    },
    {
      id: '101',
      title: 'Canned Goods',
      quantity: '10 items',
      foodType: 'Non-perishable',
      distance: '2.3 km away',
      expiryTime: 'in 1 week',
      address: '101 Cedar Rd, Westside',
      urgent: false
    },
    {
      id: '112',
      title: 'Fruits Assortment',
      quantity: '4 kg',
      foodType: 'Fruits',
      distance: '3.1 km away',
      expiryTime: 'in 3 days',
      address: '112 Apple Ave, Eastside',
      urgent: false
    }
  ];

  return (
    <NgoLayout title="Available Donations">
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search donations..."
              className="pl-9"
            />
          </div>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            className="h-10 w-10"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="icon"
            className="h-10 w-10"
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Select 
            onValueChange={setFoodTypeFilter} 
            defaultValue="all"
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Food Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="fruits">Fruits</SelectItem>
              <SelectItem value="prepared">Prepared</SelectItem>
              <SelectItem value="bakery">Bakery</SelectItem>
              <SelectItem value="non-perishable">Non-perishable</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            onValueChange={setDistanceFilter} 
            defaultValue="all"
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Distance</SelectItem>
              <SelectItem value="1">Within 1 km</SelectItem>
              <SelectItem value="2">Within 2 km</SelectItem>
              <SelectItem value="5">Within 5 km</SelectItem>
              <SelectItem value="10">Within 10 km</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {viewMode === 'map' ? (
          <div className="mb-4">
            <Map height="h-[60vh]" />
            <p className="text-sm text-center text-muted-foreground mt-2">
              Map shows {availableDonations.length} available donations
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableDonations.map(donation => (
              <DonationCard
                key={donation.id}
                id={donation.id}
                title={donation.title}
                quantity={donation.quantity}
                foodType={donation.foodType}
                distance={donation.distance}
                expiryTime={donation.expiryTime}
                urgent={donation.urgent}
                onAccept={() => console.log(`Accept donation ${donation.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </NgoLayout>
  );
};

export default AvailableDonations;
