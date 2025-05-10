
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera,
  CheckCircle,
  Star,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DeliveryLayout from '@/components/delivery/DeliveryLayout';

const DeliveryConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [rating, setRating] = useState(0);
  const maxRating = 5;
  
  // Mock handover checklist
  const handoverItems = [
    { id: 'handover1', label: 'All items handed over to NGO representative', checked: false },
    { id: 'handover2', label: 'Quality and condition verified by recipient', checked: false },
    { id: 'handover3', label: 'Temperature maintained during transit', checked: false }
  ];
  
  const [items, setItems] = useState(handoverItems);
  
  const handleCheckItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };
  
  const handleTakePhoto = () => {
    // In a real app, this would activate the camera
    toast({
      title: "Photo Captured",
      description: "Handover photo has been saved."
    });
    setPhotoTaken(true);
  };
  
  const handleRating = (value: number) => {
    setRating(value);
  };
  
  const handleConfirmDelivery = () => {
    if (items.some(item => !item.checked)) {
      toast({
        title: "Incomplete Checklist",
        description: "Please complete all handover checks before confirming.",
        variant: "destructive"
      });
      return;
    }
    
    if (!photoTaken) {
      toast({
        title: "Photo Required",
        description: "Please take a photo of the handover before confirming.",
        variant: "destructive"
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please rate your delivery experience.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Delivery Completed",
      description: "Thank you for helping feed those in need!"
    });
    
    navigate('/delivery/dashboard');
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
          <h1 className="text-xl font-semibold">Confirm Delivery</h1>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-medium mb-3">Handover Checklist</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Please verify all items have been properly handed over.
            </p>
            
            {items.map(item => (
              <div 
                key={item.id} 
                className="flex items-start py-2.5 border-b last:border-0"
              >
                <Checkbox 
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => handleCheckItem(item.id)}
                  className="mt-0.5"
                />
                <label htmlFor={item.id} className="text-sm ml-2 cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="mb-4">
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
                <span>Take Handover Photo</span>
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-medium mb-3">Rate Your Experience</h2>
            <p className="text-sm text-muted-foreground mb-3">
              How was your delivery experience?
            </p>
            
            <div className="flex justify-center space-x-2 py-2">
              {[...Array(maxRating)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button 
                    key={ratingValue}
                    className="focus:outline-none"
                    onClick={() => handleRating(ratingValue)}
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        ratingValue <= rating 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Button 
          className="w-full" 
          onClick={handleConfirmDelivery}
        >
          Complete Delivery
        </Button>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryConfirmation;
