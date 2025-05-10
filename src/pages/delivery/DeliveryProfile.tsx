
import React, { useState } from 'react';
import { 
  LogOut, 
  User, 
  Settings, 
  Truck,
  Calendar,
  Clock,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import DeliveryLayout from '@/components/delivery/DeliveryLayout';

const DeliveryProfile: React.FC = () => {
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(true);
  
  const handleAvailabilityChange = (checked: boolean) => {
    setIsAvailable(checked);
    toast({
      title: checked ? "You're now available" : "You're now unavailable",
      description: checked 
        ? "You'll receive notifications for new delivery opportunities." 
        : "You won't receive new delivery notifications."
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    // In a real app, this would handle actual logout logic and redirect
  };

  return (
    <DeliveryLayout title="Profile & Settings">
      <div className="py-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Michael Johnson</h2>
          <p className="text-muted-foreground">Delivery Partner</p>
          <div className="flex justify-center mt-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Verified
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-primary/10 rounded-full">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Availability Status</p>
                <p className="text-sm text-muted-foreground">
                  {isAvailable ? 'Available for deliveries' : 'Unavailable for deliveries'}
                </p>
              </div>
            </div>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={handleAvailabilityChange} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 mb-4">
          <h3 className="font-medium mb-3">Personal Information</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm">michael.johnson@example.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-sm">+1 (555) 987-6543</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-sm">123 Oak Street, Springfield</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 mb-4">
          <h3 className="font-medium mb-3">Vehicle Information</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Type</p>
              <p className="text-sm">Car - Sedan</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">License Plate</p>
              <p className="text-sm">ABC 123</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 mb-4">
          <h3 className="font-medium mb-3">Working Hours</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Weekdays</span>
              </div>
              <span className="text-sm">9:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Weekends</span>
              </div>
              <span className="text-sm">10:00 AM - 3:00 PM</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-3">
            <Clock className="h-4 w-4 mr-2" />
            Edit Working Hours
          </Button>
        </div>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </DeliveryLayout>
  );
};

export default DeliveryProfile;
