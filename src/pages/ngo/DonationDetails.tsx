
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Info, 
  MapPin, 
  User,
  Phone,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import NgoLayout from '@/components/ngo/NgoLayout';
import Map from '@/components/ngo/Map';

const DonationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock donation data - in a real app this would be fetched based on ID
  const donation = {
    id: id || '123',
    title: 'Fresh Vegetables',
    quantity: '5 kg',
    foodType: 'Vegetables',
    items: 'Carrots, Tomatoes, Lettuce, Bell Peppers',
    preparationDate: 'May 9, 2025',
    expiryDate: 'May 12, 2025',
    handlingInstructions: 'Keep refrigerated. Handle with clean hands.',
    address: '123 Main St, Downtown, City',
    pickupWindow: '10:00 AM - 2:00 PM, May 10, 2025',
    donor: {
      name: 'John Doe',
      organization: 'ABC Restaurant',
      phone: '+1 (555) 123-4567',
      rating: 4.8,
      verified: true
    },
    distance: '0.8 km away',
    urgent: false
  };

  const handleAccept = () => {
    toast({
      title: "Donation Accepted",
      description: "You have successfully accepted this donation. Proceed to assign pickup."
    });
    navigate(`/ngo/pickup-assignment/${id}`);
  };
  
  const handleDecline = () => {
    toast({
      title: "Donation Declined",
      description: "You have declined this donation."
    });
    navigate('/ngo/available-donations');
  };

  return (
    <NgoLayout>
      <div className="py-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Donation Details</h1>
        </div>
        
        <div className="bg-white rounded-lg border mb-4">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-lg font-semibold">{donation.title}</h2>
                <p className="text-muted-foreground">{donation.quantity} • {donation.foodType}</p>
              </div>
              <div className="flex items-center text-xs">
                <MapPin className="h-3.5 w-3.5 mr-1 text-secondary" />
                <span>{donation.distance}</span>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm">{donation.items}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-xs text-muted-foreground mb-1">Preparation Date</h3>
                  <p className="text-sm flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {donation.preparationDate}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs text-muted-foreground mb-1">Expiry Date</h3>
                  <p className="text-sm flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {donation.expiryDate}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Handling Instructions</h3>
                <p className="text-sm bg-blue-50 text-blue-700 p-2 rounded-md flex">
                  <Info className="h-4 w-4 mr-2 shrink-0" />
                  {donation.handlingInstructions}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border mb-4">
          <div className="p-4">
            <h3 className="font-medium mb-3">Pickup Location & Time</h3>
            
            <Map height="h-40" className="mb-3" />
            
            <p className="text-sm flex items-start mb-2">
              <MapPin className="h-4 w-4 mr-1 shrink-0 text-secondary" />
              <span>{donation.address}</span>
            </p>
            
            <p className="text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1 text-secondary" />
              <span>{donation.pickupWindow}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border mb-6">
          <div className="p-4">
            <h3 className="font-medium mb-3">Donor Information</h3>
            
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium flex items-center">
                  {donation.donor.name}
                  {donation.donor.verified && (
                    <Check className="h-3.5 w-3.5 text-green-600 ml-1" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{donation.donor.organization}</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full mb-2 text-sm">
              <Phone className="h-3.5 w-3.5 mr-2" />
              Contact Donor
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="w-1/2 border-destructive text-destructive"
            onClick={handleDecline}
          >
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
          <Button 
            className="w-1/2"
            onClick={handleAccept}
          >
            <Check className="h-4 w-4 mr-2" />
            Accept Donation
          </Button>
        </div>
      </div>
    </NgoLayout>
  );
};

export default DonationDetails;
