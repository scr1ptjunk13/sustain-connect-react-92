
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Loader, 
  Building, 
  Truck, 
  Timer,
  Phone,
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DonorLayout from '@/components/donor/DonorLayout';

const DonationStatus: React.FC = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  // Mock data - in a real app this would come from an API
  const donation = {
    id: id,
    status: 'accepted', // pending, accepted, in-transit, delivered, canceled
    title: 'Pasta with tomato sauce',
    quantity: '5 kg',
    date: '2025-05-10',
    time: '14:00 - 16:00',
    address: '123 Main St, Anytown, CA 12345',
    ngo: {
      name: 'Food For All',
      address: '456 Charity Ln, Anytown, CA 12345',
      phone: '+1 (555) 987-6543',
    },
    delivery: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 456-7890',
      eta: '15 minutes',
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Pending', icon: <Loader className="h-5 w-5" /> },
      { key: 'accepted', label: 'Accepted', icon: <CheckCircle className="h-5 w-5" /> },
      { key: 'in-transit', label: 'In Transit', icon: <Truck className="h-5 w-5" /> },
      { key: 'delivered', label: 'Delivered', icon: <Building className="h-5 w-5" /> },
    ];

    // Find the current step index
    const currentIndex = steps.findIndex(step => step.key === donation.status);

    return steps.map((step, index) => {
      let status;
      if (index < currentIndex) status = 'complete';
      else if (index === currentIndex) status = 'current';
      else status = 'upcoming';

      return { ...step, status };
    });
  };

  const handleCancel = () => {
    // In a real app, this would send a cancellation request to an API
    toast({
      title: "Donation Canceled",
      description: "Your donation has been canceled successfully."
    });
    // Navigate back or update status
  };

  return (
    <DonorLayout title="Donation Status">
      <div className="py-4">
        <div className="bg-white rounded-lg border p-4 mb-6">
          <h2 className="font-medium text-lg">{donation.title}</h2>
          <p className="text-sm text-muted-foreground">{donation.quantity} • {donation.date}, {donation.time}</p>
          <p className="text-sm text-muted-foreground mt-1">{donation.address}</p>
        </div>

        {donation.status !== 'canceled' ? (
          <div className="mb-6">
            <h3 className="font-medium mb-4">Status</h3>
            <div className="relative">
              {/* Status progress bar */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 z-0" />
              
              {/* Status steps */}
              <div className="space-y-8 relative z-10">
                {getStatusSteps().map((step, index) => (
                  <div key={step.key} className="flex items-start">
                    <div 
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        step.status === 'complete' ? 'bg-primary text-white' :
                        step.status === 'current' ? 'bg-primary/20 text-primary border-2 border-primary' :
                        'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{step.label}</p>
                      {step.status === 'current' && step.key === 'pending' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Waiting for an NGO to accept your donation
                        </p>
                      )}
                      {step.status === 'current' && step.key === 'accepted' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {donation.ngo.name} has accepted your donation
                        </p>
                      )}
                      {step.status === 'current' && step.key === 'in-transit' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Your donation is on the way to {donation.ngo.name}
                        </p>
                      )}
                      {step.status === 'current' && step.key === 'delivered' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Your donation has been delivered successfully
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <X className="h-4 w-4 text-gray-500" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Donation Canceled</h3>
                <p className="text-sm text-muted-foreground">
                  This donation was canceled and is no longer active.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NGO Details (if accepted or later) */}
        {['accepted', 'in-transit', 'delivered'].includes(donation.status) && (
          <div className="mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Recipient Organization
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="font-medium">{donation.ngo.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{donation.ngo.address}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                asChild
              >
                <a href={`tel:${donation.ngo.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call {donation.ngo.phone}
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Delivery Details (if in-transit) */}
        {donation.status === 'in-transit' && (
          <div className="mb-6">
            <h3 className="font-medium mb-3 flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Delivery Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="font-medium">{donation.delivery.name}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Timer className="h-4 w-4 mr-1" />
                <span>ETA: {donation.delivery.eta}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                asChild
              >
                <a href={`tel:${donation.delivery.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call {donation.delivery.phone}
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 mt-8">
          <Link to="/donor/donation-history">
            <Button variant="outline" className="w-full">
              View All Donations
            </Button>
          </Link>

          {donation.status === 'pending' && (
            <Button 
              variant="destructive"
              className="w-full"
              onClick={handleCancel}
            >
              Cancel Donation
            </Button>
          )}
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonationStatus;
