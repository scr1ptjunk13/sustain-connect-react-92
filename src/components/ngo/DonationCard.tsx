
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DonationCardProps {
  id: string;
  title: string;
  quantity: string;
  foodType: string;
  distance: string;
  expiryTime: string;
  urgent?: boolean;
  address?: string;
  onAccept?: () => void;
}

const DonationCard: React.FC<DonationCardProps> = ({
  id,
  title,
  quantity,
  foodType,
  distance,
  expiryTime,
  urgent = false,
  address,
  onAccept
}) => {
  return (
    <div className="bg-white rounded-lg border mb-3 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{quantity} • {foodType}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs flex items-center text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1" /> {distance}
            </span>
            {urgent && (
              <Badge variant="destructive" className="text-xs">Expiring Soon</Badge>
            )}
          </div>
        </div>
        
        {address && (
          <div className="flex items-center text-xs text-muted-foreground mt-1 mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{address}</span>
          </div>
        )}
        
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>Expires {expiryTime}</span>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8"
            asChild
          >
            <Link to={`/ngo/donation-details/${id}`}>
              View Details
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
          
          {onAccept && (
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

export default DonationCard;
