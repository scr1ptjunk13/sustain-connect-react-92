
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Truck, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DeliveryCardProps {
  id: string;
  title: string;
  pickupAddress: string;
  dropoffAddress: string;
  distance: string;
  estimatedTime: string;
  compensation?: string;
  status?: 'available' | 'active' | 'completed';
  onAccept?: () => void;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  id,
  title,
  pickupAddress,
  dropoffAddress,
  distance,
  estimatedTime,
  compensation,
  status = 'available',
  onAccept
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg border mb-3 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">
              ~{estimatedTime} • {distance}
            </p>
          </div>
          <div>
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="space-y-1 my-3">
          <p className="text-sm flex items-start">
            <MapPin className="h-4 w-4 mr-2 shrink-0 text-primary" />
            <span className="text-sm">Pickup: {pickupAddress}</span>
          </p>
          <p className="text-sm flex items-start">
            <Truck className="h-4 w-4 mr-2 shrink-0 text-primary" />
            <span className="text-sm">Dropoff: {dropoffAddress}</span>
          </p>
        </div>
        
        {compensation && (
          <p className="text-sm font-medium my-2">
            Compensation: {compensation}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8"
            asChild
          >
            <Link to={`/delivery/details/${id}`}>
              View Details
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
          
          {status === 'available' && onAccept && (
            <Button 
              size="sm" 
              className="text-xs h-8"
              onClick={onAccept}
            >
              Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;
