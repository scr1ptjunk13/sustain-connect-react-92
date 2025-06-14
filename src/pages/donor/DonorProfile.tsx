
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  CheckCircle,  
  SlidersHorizontal, 
  HelpCircle,
  LogOut,
  ArrowRight,
  CheckCircle as CheckCircleIcon,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import DonorLayout from '@/components/donor/DonorLayout';
import ProfileEditForm from '@/components/auth/ProfileEditForm';

const DonorProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
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

  if (loading) {
    return (
      <DonorLayout>
        <div className="py-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </DonorLayout>
    );
  }

  if (isEditing) {
    return (
      <DonorLayout>
        <div className="py-4">
          <ProfileEditForm
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      </DonorLayout>
    );
  }

  return (
    <DonorLayout>
      <div className="py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Profile</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <ProfileSection 
          icon={<User className="h-5 w-5 text-primary" />}
          title="Personal Information"
        >
          <div className="bg-white rounded-lg border p-4">
            <ProfileItem label="Name" value={profile?.full_name || 'Not provided'} />
            <Separator />
            <ProfileItem label="Email" value={profile?.email || user?.email || 'Not provided'} />
            <Separator />
            <ProfileItem label="Phone" value={profile?.phone || 'Not provided'} />
            <Separator />
            <ProfileItem label="Role" value="Donor" />
          </div>
        </ProfileSection>

        <ProfileSection 
          icon={<CheckCircle className="h-5 w-5 text-primary" />}
          title="Account Status"
        >
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email_confirmed_at ? 'Email verified' : 'Email not verified'}
                </p>
              </div>
              {user?.email_confirmed_at ? (
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Verified
                </div>
              ) : (
                <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                  Pending
                </div>
              )}
            </div>
            <Separator className="my-3" />
            <ProfileItem 
              label="Member Since" 
              value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
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
