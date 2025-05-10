
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle,
  Filter,
  Search 
} from 'lucide-react';
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
import StatisticCard from '@/components/delivery/StatisticCard';

const DeliveryHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  
  // Mock data for delivery history
  const completedDeliveries = [
    {
      id: '101',
      title: 'Canned Goods',
      pickupAddress: '101 Cedar Rd, Westside',
      dropoffAddress: 'Senior Center, 303 Elder Blvd',
      distance: '5.5 km',
      estimatedTime: '25 min',
      compensation: '$12.00',
      completedDate: 'Today, 1:30 PM'
    },
    {
      id: '102',
      title: 'Fresh Produce',
      pickupAddress: '202 Maple Ave, Northside',
      dropoffAddress: 'Community Kitchen, 505 Cook St',
      distance: '3.8 km',
      estimatedTime: '18 min',
      compensation: '$9.00',
      completedDate: 'Yesterday, 11:15 AM'
    },
    {
      id: '103',
      title: 'Bakery Items',
      pickupAddress: '303 Pine Rd, Eastside',
      dropoffAddress: 'Homeless Shelter, 707 Hope Ave',
      distance: '4.2 km',
      estimatedTime: '20 min',
      compensation: '$10.50',
      completedDate: 'May 8, 2025 3:45 PM'
    },
    {
      id: '104',
      title: 'Dairy Products',
      pickupAddress: '404 Birch St, Southside',
      dropoffAddress: 'Youth Center, 909 Future Rd',
      distance: '2.9 km',
      estimatedTime: '15 min',
      compensation: '$7.50',
      completedDate: 'May 7, 2025 2:20 PM'
    }
  ];
  
  // Calculate statistics
  const totalDeliveries = completedDeliveries.length;
  const totalDistance = '16.4 km';
  const totalEarnings = '$39.00';

  return (
    <DeliveryLayout title="Delivery History">
      <div className="py-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatisticCard 
            title="Deliveries" 
            value={totalDeliveries} 
            icon={<CheckCircle className="h-5 w-5 text-primary" />} 
          />
          <StatisticCard 
            title="Distance" 
            value={totalDistance} 
            icon={<CheckCircle className="h-5 w-5 text-primary" />} 
          />
          <StatisticCard 
            title="Earnings" 
            value={totalEarnings} 
            icon={<CheckCircle className="h-5 w-5 text-primary" />} 
          />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Select 
            onValueChange={setPeriodFilter} 
            defaultValue="all"
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="h-9 text-xs gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            Date Range
          </Button>
          
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 mb-4">
          {completedDeliveries.map(delivery => (
            <DeliveryCard
              key={delivery.id}
              id={delivery.id}
              title={delivery.title}
              pickupAddress={delivery.pickupAddress}
              dropoffAddress={delivery.dropoffAddress}
              distance={delivery.distance}
              estimatedTime={delivery.completedDate}
              compensation={delivery.compensation}
              status="completed"
            />
          ))}
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryHistory;
