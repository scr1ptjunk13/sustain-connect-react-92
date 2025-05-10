
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Calendar, 
  Filter, 
  Users, 
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NgoLayout from '@/components/ngo/NgoLayout';
import Map from '@/components/ngo/Map';
import StatisticCard from '@/components/ngo/StatisticCard';
import DonationCard from '@/components/ngo/DonationCard';

const NgoDashboard: React.FC = () => {
  // Mock data for the dashboard statistics
  const todayStats = {
    availableDonations: 12,
    pendingPickups: 3,
    activeDeliveries: 2,
    totalKgToday: 45
  };
  
  // Mock available donation data
  const nearbyDonations = [
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
    }
  ];

  return (
    <NgoLayout title="NGO Dashboard">
      <div className="py-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Daily Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatisticCard
              title="Available Donations"
              value={todayStats.availableDonations}
              icon={<Calendar className="h-5 w-5 text-secondary" />}
            />
            <StatisticCard
              title="Pending Pickups"
              value={todayStats.pendingPickups}
              icon={<Clock className="h-5 w-5 text-secondary" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <StatisticCard
              title="Active Deliveries"
              value={todayStats.activeDeliveries}
              icon={<Truck className="h-5 w-5 text-secondary" />}
            />
            <StatisticCard
              title="Total Food Today"
              value={`${todayStats.totalKgToday} kg`}
              icon={<Users className="h-5 w-5 text-secondary" />}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Available Donations</h2>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="prepared">Prepared</SelectItem>
                  <SelectItem value="packaged">Packaged</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Map height="h-48" className="mb-4" />

          {nearbyDonations.map(donation => (
            <DonationCard
              key={donation.id}
              id={donation.id}
              title={donation.title}
              quantity={donation.quantity}
              foodType={donation.foodType}
              distance={donation.distance}
              expiryTime={donation.expiryTime}
              address={donation.address}
              urgent={donation.urgent}
              onAccept={() => console.log(`Accept donation ${donation.id}`)}
            />
          ))}

          <Button asChild variant="outline" className="w-full mt-2">
            <Link to="/ngo/available-donations">
              View All Available Donations
            </Link>
          </Button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Pending Pickups</h2>
            <Button size="sm" variant="ghost" asChild>
              <Link to="/ngo/active-pickups">View All</Link>
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium">Bakery Items</h3>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-sm text-muted-foreground">2.5 kg • Bread, Pastries</p>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Pickup: Today, 2:30 PM
                </span>
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  1.5 km away
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium">Rice and Beans</h3>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-sm text-muted-foreground">4 kg • Dry Goods</p>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Pickup: Tomorrow, 10:00 AM
                </span>
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  2.3 km away
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NgoLayout>
  );
};

export default NgoDashboard;
