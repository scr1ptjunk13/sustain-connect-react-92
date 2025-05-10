
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DeliveryLayout from '@/components/delivery/DeliveryLayout';

const PickupConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photoTaken, setPhotoTaken] = useState(false);
  
  // Mock donation items
  const donationItems = [
    { id: 'item1', name: 'Carrots', quantity: '1 kg', checked: false },
    { id: 'item2', name: 'Tomatoes', quantity: '2 kg', checked: false },
    { id: 'item3', name: 'Lettuce', quantity: '1 kg', checked: false },
    { id: 'item4', name: 'Potatoes', quantity: '1 kg', checked: false }
  ];
  
  const [items, setItems] = useState(donationItems);
  
  const handleCheckItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };
  
  const handleTakePhoto = () => {
    // In a real app, this would activate the camera
    toast({
      title: "Photo Captured",
      description: "Donation photo has been saved."
    });
    setPhotoTaken(true);
  };
  
  const handleConfirmPickup = () => {
    if (items.some(item => !item.checked)) {
      toast({
        title: "Incomplete Checklist",
        description: "Please verify all items before confirming pickup.",
        variant: "destructive"
      });
      return;
    }
    
    if (!photoTaken) {
      toast({
        title: "Photo Required",
        description: "Please take a photo of the donation before confirming.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Pickup Confirmed",
      description: "You can now proceed to delivery."
    });
    
    navigate(`/delivery/in-transit/${id}`);
  };

  return (
    <DeliveryLayout>
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
          <h1 className="text-xl font-semibold">Confirm Pickup</h1>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-medium mb-3">Donation Checklist</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Please verify all items before confirming pickup.
            </p>
            
            {items.map(item => (
              <div 
                key={item.id} 
                className="flex items-center justify-between py-2.5 border-b last:border-0"
              >
                <div className="flex items-center">
                  <Checkbox 
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={() => handleCheckItem(item.id)}
                  />
                  <label htmlFor={item.id} className="text-sm ml-2 cursor-pointer flex-grow">
                    {item.name}
                  </label>
                </div>
                <span className="text-sm text-muted-foreground">{item.quantity}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-medium mb-3">Quality Verification</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox id="quality1" />
                <label htmlFor="quality1" className="text-sm ml-2">
                  Food items are in good condition
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox id="quality2" />
                <label htmlFor="quality2" className="text-sm ml-2">
                  Packaging is intact
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox id="quality3" />
                <label htmlFor="quality3" className="text-sm ml-2">
                  Temperature appears appropriate
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-medium mb-3">Photo Documentation</h2>
            
            {photoTaken ? (
              <div className="relative bg-gray-100 rounded-lg p-4 h-40 flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-muted-foreground">Photo captured</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => setPhotoTaken(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                className="w-full h-40 flex-col"
                onClick={handleTakePhoto}
              >
                <Camera className="h-8 w-8 mb-2" />
                <span>Take Photo</span>
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Button 
          className="w-full" 
          onClick={handleConfirmPickup}
        >
          Confirm Pickup
        </Button>
      </div>
    </DeliveryLayout>
  );
};

export default PickupConfirmation;
