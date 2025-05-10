
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Check, Send, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import DonorLayout from '@/components/donor/DonorLayout';

const DonationReviewSubmit: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Mock data - in a real app this would come from previous screens
  const donationData = {
    food: {
      type: 'Cooked Food',
      name: 'Pasta with tomato sauce',
      quantity: '5',
      unit: 'kg',
      prepDate: '2025-05-10',
      expiryTime: '2025-05-11T18:00',
      specialInstructions: 'Keep refrigerated',
      image: null
    },
    pickup: {
      address: '123 Main St, Anytown, CA 12345',
      date: '2025-05-10',
      timeWindow: '14:00 - 16:00',
      contactName: 'John Doe',
      contactPhone: '+1 (555) 123-4567',
      specialInstructions: 'Ring doorbell upon arrival'
    }
  };

  const handleSubmit = () => {
    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "You must accept the terms to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would submit the donation data to an API
    toast({
      title: "Donation Submitted!",
      description: "Your donation has been submitted successfully."
    });
    
    // Navigate to the donation status page with a mock ID
    navigate('/donor/donation-status/new123');
  };

  const SectionHeading = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="text-lg font-medium ml-2">{title}</h3>
    </div>
  );

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );

  return (
    <DonorLayout title="Review & Submit">
      <div className="py-4">
        <div className="space-y-6">
          <div>
            <SectionHeading 
              icon={<List className="h-5 w-5 text-primary" />}
              title="Donation Details" 
            />
            
            <div className="bg-white rounded-lg border p-4">
              <DetailItem label="Food Type" value={donationData.food.type} />
              <Separator className="my-1" />
              <DetailItem label="Food Name" value={donationData.food.name} />
              <Separator className="my-1" />
              <DetailItem 
                label="Quantity" 
                value={`${donationData.food.quantity} ${donationData.food.unit}`} 
              />
              <Separator className="my-1" />
              <DetailItem label="Preparation Date" value={donationData.food.prepDate} />
              <Separator className="my-1" />
              <DetailItem label="Expiry Time" value={donationData.food.expiryTime} />
              
              {donationData.food.specialInstructions && (
                <>
                  <Separator className="my-1" />
                  <DetailItem 
                    label="Special Instructions" 
                    value={donationData.food.specialInstructions} 
                  />
                </>
              )}
              
              {donationData.food.image && (
                <>
                  <Separator className="my-1" />
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground">Photo</p>
                    <div className="mt-1">
                      <img 
                        src={donationData.food.image} 
                        alt="Food" 
                        className="w-full h-32 object-cover rounded-md" 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <SectionHeading 
              icon={<MapPin className="h-5 w-5 text-primary" />}
              title="Pickup Details" 
            />
            
            <div className="bg-white rounded-lg border p-4">
              <DetailItem label="Address" value={donationData.pickup.address} />
              <Separator className="my-1" />
              <DetailItem label="Date" value={donationData.pickup.date} />
              <Separator className="my-1" />
              <DetailItem label="Time Window" value={donationData.pickup.timeWindow} />
              <Separator className="my-1" />
              <DetailItem label="Contact Name" value={donationData.pickup.contactName} />
              <Separator className="my-1" />
              <DetailItem label="Contact Phone" value={donationData.pickup.contactPhone} />
              
              {donationData.pickup.specialInstructions && (
                <>
                  <Separator className="my-1" />
                  <DetailItem 
                    label="Special Instructions" 
                    value={donationData.pickup.specialInstructions} 
                  />
                </>
              )}
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 border">
            <div className="flex space-x-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)} 
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight cursor-pointer"
              >
                I confirm that the food is safe for consumption, properly handled, and meets all
                food safety requirements. I understand that the receiving organization will
                inspect the donation upon pickup.
              </label>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={!termsAccepted}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Donation
          </Button>
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonationReviewSubmit;
