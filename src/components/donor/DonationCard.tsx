
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DonationCardProps {
  id: string;
  title: string;
  quantity: string;
  date: string;
  status: 'pending' | 'accepted' | 'in-transit' | 'delivered' | 'canceled';
  ngo?: string;
}

const DonationCard: React.FC<DonationCardProps> = ({
  id,
  title,
  quantity,
  date,
  status,
  ngo
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{quantity} • {date}</p>
          {ngo && <p className="text-sm mt-1">Recipient: {ngo}</p>}
        </div>
        <Badge className={getStatusColor()}>{getStatusText()}</Badge>
      </div>
      <div className="mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          asChild
        >
          <Link to={`/donor/donation-status/${id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default DonationCard;
