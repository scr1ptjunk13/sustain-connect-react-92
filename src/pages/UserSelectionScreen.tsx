
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import UserTypeCard from '@/components/UserTypeCard';
import SdgBadge from '@/components/SdgBadge';

const UserSelectionScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectUserType = (type: string) => {
    // Store the user type and navigate to registration
    localStorage.setItem('userType', type);
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 screen-fade-in">
      <div className="flex items-center justify-center mb-8">
        <Logo size="sm" />
      </div>
      
      <h1 className="text-2xl font-bold text-center">Join SustainConnect</h1>
      <p className="text-gray-600 text-center mb-8">Choose how you want to contribute</p>
      
      <div className="space-y-4 mb-8">
        <UserTypeCard 
          type="donor" 
          onSelect={() => handleSelectUserType('donor')} 
        />
        <UserTypeCard 
          type="ngo" 
          onSelect={() => handleSelectUserType('ngo')} 
        />
        <UserTypeCard 
          type="delivery" 
          onSelect={() => handleSelectUserType('delivery')} 
        />
      </div>
      
      <div className="mt-auto space-y-6">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500">Already have an account?</p>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
        </div>
        
        <div className="flex justify-center">
          <SdgBadge />
        </div>
      </div>
    </div>
  );
};

export default UserSelectionScreen;
