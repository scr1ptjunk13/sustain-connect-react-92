
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Truck, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import DeliveryLayout from '@/components/delivery/DeliveryLayout';
import Map from '@/components/ngo/Map';

const ActiveDeliveries: React.FC = () => {
  // Mock data for active and upcoming deliveries
  const activeDeliveries = [
    {
      id: '123',
      title: 'Fresh Vegetables',
      pickupAddress: '123 Main St, Downtown',
      dropoffAddress: 'Food Bank, 789 Charity Ave',
      status: 'in_progress',
      stage: 'pickup',
      eta: '5 min to pickup'
    }
  ];
  
  const scheduledDeliveries = [
    {
      id: '456',
      title: 'Bakery Items',
      pickupAddress: '789 Pine St, Uptown',
      dropoffAddress: 'Homeless Shelter, 202 Care Rd',
      pickupTime: 'Today, 3:30 PM'
    }
  ];
  
  const DeliveryStatusBadge = ({ status, stage }: { status: string, stage?: string }) => {
    if (status === 'in_progress') {
      return stage === 'pickup' ? 
        <Badge className="bg-amber-500">En Route to Pickup</Badge> : 
        <Badge className="bg-amber-500">En Route to Dropoff</Badge>;
    }
    return <Badge variant="outline">Scheduled</Badge>;
  };

  return (
    <DeliveryLayout title="Active Deliveries">
      <div className="py-4">
        <Map height="h-40" className="mb-4" />
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">Active ({activeDeliveries.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({scheduledDeliveries.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-2">
            {activeDeliveries.map(delivery => (
              <div key={delivery.id} className="bg-white rounded-lg border overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{delivery.title}</h3>
                    <DeliveryStatusBadge status={delivery.status} stage={delivery.stage} />
                  </div>
                  
                  <div className="space-y-1 my-3">
                    <p className="text-sm flex items-start">
                      <MapPin className="h-4 w-4 mr-2 shrink-0 text-primary" />
                      <span>Pickup: {delivery.pickupAddress}</span>
                    </p>
                    <p className="text-sm flex items-start">
                      <Truck className="h-4 w-4 mr-2 shrink-0 text-primary" />
                      <span>Dropoff: {delivery.dropoffAddress}</span>
                    </p>
                    <p className="text-sm flex items-start text-amber-600 font-medium">
                      <Clock className="h-4 w-4 mr-2 shrink-0 text-amber-600" />
                      <span>ETA: {delivery.eta}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button asChild className="w-full">
                      <Link to={`/delivery/navigation/${delivery.id}`}>
                        Continue Navigation
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {activeDeliveries.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No active deliveries at the moment.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-2">
            {scheduledDeliveries.map(delivery => (
              <div key={delivery.id} className="bg-white rounded-lg border overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{delivery.title}</h3>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  
                  <div className="space-y-1 my-3">
                    <p className="text-sm flex items-start">
                      <MapPin className="h-4 w-4 mr-2 shrink-0 text-primary" />
                      <span>Pickup: {delivery.pickupAddress}</span>
                    </p>
                    <p className="text-sm flex items-start">
                      <Truck className="h-4 w-4 mr-2 shrink-0 text-primary" />
                      <span>Dropoff: {delivery.dropoffAddress}</span>
                    </p>
                    <p className="text-sm flex items-start">
                      <Clock className="h-4 w-4 mr-2 shrink-0 text-primary" />
                      <span>Scheduled: {delivery.pickupTime}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8 flex-1"
                      asChild
                    >
                      <Link to={`/delivery/details/${delivery.id}`}>
                        View Details
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {scheduledDeliveries.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No scheduled deliveries at the moment.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DeliveryLayout>
  );
};

export default ActiveDeliveries;
