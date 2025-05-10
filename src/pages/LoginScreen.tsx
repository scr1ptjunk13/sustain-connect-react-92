
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import AuthInput from '@/components/AuthInput';
import PasswordInput from '@/components/PasswordInput';
import { toast } from '@/components/ui/use-toast';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Login would happen here in a real app
    toast({
      title: "Login successful!",
      description: "Welcome back to SustainConnect.",
    });
    
    // Navigate to home or dashboard in a real app
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen p-6 screen-fade-in">
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
      
      <form onSubmit={handleSubmit} className="form-container">
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />
        
        <PasswordInput
          id="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />
        
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={() => navigate('/recover-password')}
            className="text-sm text-primary-600 font-medium"
          >
            Forgot Password?
          </button>
        </div>
        
        <Button type="submit" className="w-full mt-6">
          Log In
        </Button>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Don't have an account yet?{' '}
            <button 
              type="button"
              onClick={() => navigate('/select-role')}
              className="text-primary-600 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
