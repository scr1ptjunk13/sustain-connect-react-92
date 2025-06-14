
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthInput from '@/components/AuthInput';
import PasswordInput from '@/components/PasswordInput';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!showForgotPassword && !formData.password) {
      newErrors.password = 'Password is required';
    }
    
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
      if (showForgotPassword) {
        const { error } = await resetPassword(formData.email);
        
        if (error) {
          toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Reset email sent",
            description: "Check your email for password reset instructions"
          });
          setShowForgotPassword(false);
        }
      } else {
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
        }
        // Success handling is done in AuthContext via onAuthStateChange
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-1 text-center">
        {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
      </h1>
      <p className="text-gray-600 text-center mb-6">
        {showForgotPassword 
          ? 'Enter your email to receive reset instructions'
          : 'Sign in to continue making a difference'
        }
      </p>
      
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
        
        {!showForgotPassword && (
          <PasswordInput
            id="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />
        )}
        
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading 
            ? (showForgotPassword ? 'Sending...' : 'Signing in...')
            : (showForgotPassword ? 'Send Reset Email' : 'Sign In')
          }
        </Button>
        
        <div className="text-center mt-4">
          <button 
            type="button"
            onClick={() => {
              setShowForgotPassword(!showForgotPassword);
              setErrors({});
            }}
            className="text-primary-600 font-medium text-sm"
          >
            {showForgotPassword ? 'Back to Login' : 'Forgot Password?'}
          </button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
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
    </>
  );
};

export default LoginForm;
