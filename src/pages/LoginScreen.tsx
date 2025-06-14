
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import AuthInput from '@/components/AuthInput';
PasswordInput from '@/components/PasswordInput';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const { signIn, user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect authenticated users to appropriate dashboard
    if (user) {
      redirectToDashboard();
    }
  }, [user, navigate]);

  const redirectToDashboard = async () => {
    if (!user) return;
    
    try {
      // Get user profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role) {
        switch (profile.role) {
          case 'donor':
            navigate('/donor/dashboard');
            break;
          case 'ngo':
            navigate('/ngo/dashboard');
            break;
          case 'delivery':
            navigate('/delivery/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigate('/');
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email not verified",
            description: "Please check your email and click the verification link before logging in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Login successful!",
          description: "Welcome back to SustainConnect.",
        });
        // redirectToDashboard will be called automatically when user state updates
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
        
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
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
