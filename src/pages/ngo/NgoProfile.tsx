
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  CheckCircle,  
  SlidersHorizontal, 
  HelpCircle,
  LogOut,
  ArrowRight,
  MapPin,
  Users,
  CheckCircle as CheckCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import NgoLayout from '@/components/ngo/NgoLayout';

const NgoProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock organization data
  const organization = {
    name: 'Community Food Bank',
    email: 'contact@communityfoodbank.org',
    phone: '+1 (555) 987-6543',
    address: '789 Center Street, Downtown, City',
    serviceArea: '10 km radius',
    teamSize: 12,
    verified: true,
    joinedDate: 'March 2025',
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
    <NgoLayout>
      <div className="py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Organization Profile</h1>
        </div>

        <ProfileSection 
          icon={<Building className="h-5 w-5 text-secondary" />}
          title="Organization Information"
        >
          <div className="bg-white rounded-lg border p-4">
            <ProfileItem label="Name" value={organization.name} />
            <Separator />
            <ProfileItem label="Email" value={organization.email} />
            <Separator />
            <ProfileItem label="Phone" value={organization.phone} />
            <Separator />
            <ProfileItem 
              label="Address" 
              value={
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                  {organization.address}
                </div>
              } 
            />
          </div>
        </ProfileSection>

        <ProfileSection 
          icon={<CheckCircle className="h-5 w-5 text-secondary" />}
          title="Organization Status"
        >
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">Verification Status</p>
                <p className="text-sm text-muted-foreground">Organization verified</p>
              </div>
              {organization.verified ? (
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
            
            <Separator className="mb-3" />
            
            <div className="grid grid-cols-2 gap-4">
              <ProfileItem 
                label="Service Area" 
                value={organization.serviceArea} 
              />
              <div className="py-3">
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="font-medium mt-1 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-secondary" />
                  {organization.teamSize} members
                </p>
              </div>
            </div>
            
            <Separator />
            
            <ProfileItem 
              label="Member Since" 
              value={organization.joinedDate} 
            />
          </div>
        </ProfileSection>

        <ProfileSection 
          icon={<SlidersHorizontal className="h-5 w-5 text-secondary" />}
          title="Settings & Support"
        >
          <div className="bg-white rounded-lg border divide-y">
            <SettingsLink 
              icon={<SlidersHorizontal className="h-5 w-5 text-muted-foreground" />}
              label="Team Management"
              onClick={() => toast({ 
                title: "Team Management", 
                description: "This feature is coming soon!"
              })}
            />
            <SettingsLink 
              icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
              label="Service Area Settings"
              onClick={() => toast({ 
                title: "Service Area", 
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
    </NgoLayout>
  );
};

export default NgoProfile;
