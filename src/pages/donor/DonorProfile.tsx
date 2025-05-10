
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  CheckCircle,  
  SlidersHorizontal, 
  HelpCircle,
  LogOut,
  ArrowRight,
  CheckCircle as CheckCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import DonorLayout from '@/components/donor/DonorLayout';

const DonorProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    organization: 'ABC Restaurant',
    verified: true,
    joinedDate: 'April 2025',
  };

  const handleLogout = () => {
    // In a real app, this would call an API to log the user out
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    
    // Navigate to the login screen
    navigate('/login');
  };

  const ProfileSection = ({ 
    icon, 
    title, 
    children 
  }: { 
    icon: React.ReactNode; 
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        {icon}
        <h2 className="text-lg font-semibold ml-2">{title}</h2>
      </div>
      {children}
    </div>
  );

  const ProfileItem = ({ 
    label, 
    value 
  }: { 
    label: string; 
    value: string | React.ReactNode;
  }) => (
    <div className="py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );

  const SettingsLink = ({ 
    icon, 
    label,
    onClick
  }: { 
    icon: React.ReactNode; 
    label: string;
    onClick?: () => void;
  }) => (
    <button 
      onClick={onClick}
      className="flex items-center justify-between w-full py-3"
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );

  return (
    <DonorLayout>
      <div className="py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>

        <ProfileSection 
          icon={<User className="h-5 w-5 text-primary" />}
          title="Personal Information"
        >
          <div className="bg-white rounded-lg border p-4">
            <ProfileItem label="Name" value={user.name} />
            <Separator />
            <ProfileItem label="Email" value={user.email} />
            <Separator />
            <ProfileItem label="Phone" value={user.phone} />
            <Separator />
            <ProfileItem label="Organization" value={user.organization} />
          </div>
        </ProfileSection>

        <ProfileSection 
          icon={<CheckCircle className="h-5 w-5 text-primary" />}
          title="Account Status"
        >
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Verification Status</p>
                <p className="text-sm text-muted-foreground">Account verified</p>
              </div>
              {user.verified ? (
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Verified
                </div>
              ) : (
                <Button size="sm" className="text-xs">
                  Verify Now
                </Button>
              )}
            </div>
            <Separator className="my-3" />
            <ProfileItem 
              label="Member Since" 
              value={user.joinedDate} 
            />
          </div>
        </ProfileSection>

        <ProfileSection 
          icon={<SlidersHorizontal className="h-5 w-5 text-primary" />}
          title="Settings & Support"
        >
          <div className="bg-white rounded-lg border divide-y">
            <SettingsLink 
              icon={<SlidersHorizontal className="h-5 w-5 text-muted-foreground" />}
              label="Preferences"
              onClick={() => toast({ 
                title: "Preferences", 
                description: "This feature is coming soon!"
              })}
            />
            <SettingsLink 
              icon={<HelpCircle className="h-5 w-5 text-muted-foreground" />}
              label="Contact Support"
              onClick={() => toast({ 
                title: "Contact Support", 
                description: "Support features are coming soon!"
              })}
            />
          </div>
        </ProfileSection>

        <Button 
          variant="outline" 
          className="w-full border-destructive text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </DonorLayout>
  );
};

export default DonorProfile;
