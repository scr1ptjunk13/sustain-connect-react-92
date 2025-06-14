
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

const LoginHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/select-role')}
          className="mr-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Logo size="sm" />
        <div className="ml-auto w-8"></div> {/* For balance */}
      </div>
      
      <h1 className="text-2xl font-bold mb-2 text-center">Welcome Back</h1>
      <p className="text-gray-600 text-center mb-8">Log in to your SustainConnect account</p>
    </>
  );
};

export default LoginHeader;
