
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Clock, 
  Phone, 
  MapPin,
  ExternalLink,
  User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import NgoLayout from '@/components/ngo/NgoLayout';
import Map from '@/components/ngo/Map';

const ActivePickups: React.FC = () => {
  // Mock data for active pickups
  const pickups = [
    {
      id: '123',
      title: 'Fresh Vegetables',
      donorName: 'John Doe',
      donorAddress: '123 Main St, Downtown',
      pickupTime: 'Today, 2:30 PM',
      status: 'assigned',
      driver: {
        name: 'Michael Johnson',
        phone: '+1 (555) 987-6543',
        eta: '15 min',
        location: 'En route to pickup'
      }
    },
    {
      id: '456',
      title: 'Cooked Pasta',
      donorName: 'Sarah Williams',
      donorAddress: '456 Oak Ave, Midtown',
      pickupTime: 'Today, 4:00 PM',
      status: 'in_progress',
      driver: {
        name: 'Robert Davis',
        phone: '+1 (555) 123-4567',
        eta: 'Arrived',
        location: 'At pickup location'
      }
    },
    {
      id: '789',
      title: 'Bakery Items',
      donorName: 'Emily Taylor',
      donorAddress: '789 Pine St, Uptown',
      pickupTime: 'Tomorrow, 10:00 AM',
      status: 'assigned',
      driver: {
        name: 'James Wilson',
        phone: '+1 (555) 345-6789',
        eta: 'Scheduled',
        location: 'Awaiting pickup time'
      }
    },
    {
      id: '101',
      title: 'Canned Goods',
      donorName: 'David Brown',
      donorAddress: '101 Cedar Rd, Westside',
      pickupTime: 'Yesterday, 1:00 PM',
      status: 'completed',
      driver: {
        name: 'Michael Johnson',
        phone: '+1 (555) 987-6543',
        eta: 'Delivered',
        location: 'At NGO facility'
      }
    }
  ];

  const activePickups = pickups.filter(p => p.status === 'assigned' || p.status === 'in_progress');
  const completedPickups = pickups.filter(p => p.status === 'completed');

  const PickupStatus = ({ status }: { status: string }) => {
    switch(status) {
      case 'assigned':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      default:
        return null;
    }
  };

  const PickupCard = ({ pickup }: { pickup: typeof pickups[0] }) => (
    <div className="bg-white rounded-lg border mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{pickup.title}</h3>
            <p className="text-sm text-muted-foreground">Donor: {pickup.donorName}</p>
          </div>
          <PickupStatus status={pickup.status} />
        </div>
        
        <div className="mt-3 text-sm">
          <p className="flex items-center mb-1">
            <MapPin className="h-4 w-4 mr-2 text-secondary" />
            {pickup.donorAddress}
          </p>
          <p className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-secondary" />
            {pickup.pickupTime}
          </p>
        </div>
        
        <div className="mt-4 bg-secondary/5 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-secondary/20 rounded-full flex items-center justify-center mr-2">
                <User className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">{pickup.driver.name}</p>
                <p className="text-xs text-muted-foreground">{pickup.driver.location}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-secondary">ETA: {pickup.driver.eta}</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline" className="text-xs flex-1">
              <Phone className="h-3 w-3 mr-1" />
              Call Driver
            </Button>
            <Button size="sm" variant="secondary" className="text-xs flex-1" asChild>
              <Link to={`/ngo/pickup-tracking/${pickup.id}`}>
                Track
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <NgoLayout title="Active Pickups">
      <div className="py-4">
        <Map height="h-40" className="mb-4" />
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">Active ({activePickups.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedPickups.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-1">
            {activePickups.map(pickup => (
              <PickupCard key={pickup.id} pickup={pickup} />
            ))}
            
            {activePickups.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No active pickups at the moment.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-1">
            {completedPickups.map(pickup => (
              <PickupCard key={pickup.id} pickup={pickup} />
            ))}
            
            {completedPickups.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No completed pickups yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </NgoLayout>
  );
};

export default ActivePickups;
