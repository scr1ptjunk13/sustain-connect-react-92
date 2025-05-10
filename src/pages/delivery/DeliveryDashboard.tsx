
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  MapPin,
  Clock,
  CircleDollarSign
} from 'lucide-react';
import DeliveryLayout from '@/components/delivery/DeliveryLayout';
import DeliveryCard from '@/components/delivery/DeliveryCard';
import StatisticCard from '@/components/delivery/StatisticCard';
import Map from '@/components/ngo/Map';

const DeliveryDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - in a real app this would come from API
  const nearbyDeliveries = [
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
    }
  ];
  
  const handleAcceptDelivery = (id: string) => {
    navigate(`/delivery/details/${id}`);
  };

  return (
    <DeliveryLayout title="Delivery Dashboard">
      <div className="py-4">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-3">Current Status</h2>
          <div className="flex items-center bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">You're available for deliveries</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Today's Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatisticCard 
              title="Deliveries" 
              value="3" 
              icon={<Truck className="h-5 w-5 text-primary" />} 
            />
            <StatisticCard 
              title="Distance" 
              value="12.5 km" 
              icon={<MapPin className="h-5 w-5 text-primary" />} 
            />
            <StatisticCard 
              title="Active Time" 
              value="2.5 hrs" 
              icon={<Clock className="h-5 w-5 text-primary" />} 
            />
            <StatisticCard 
              title="Earnings" 
              value="$28.50" 
              icon={<CircleDollarSign className="h-5 w-5 text-primary" />} 
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Nearby Deliveries</h2>
          <Map height="h-40" className="mb-4" />
          <div className="space-y-2">
            {nearbyDeliveries.map(delivery => (
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
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryDashboard;
