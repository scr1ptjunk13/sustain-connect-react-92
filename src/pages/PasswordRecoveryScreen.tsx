
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
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  verificationCode?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const PasswordRecoveryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'verification' | 'newPassword'>('email');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
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

  const validateEmailStep = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    return newErrors;
  };

  const validateVerificationStep = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.verificationCode) newErrors.verificationCode = 'Verification code is required';
    else if (formData.verificationCode.length !== 6 || !/^\d+$/.test(formData.verificationCode)) {
      newErrors.verificationCode = 'Enter valid 6-digit code';
    }
    
    return newErrors;
  };

  const validateNewPasswordStep = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmitEmail = () => {
    const validationErrors = validateEmailStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // In a real app, this would send an email with a verification code
    toast({
      title: "Verification code sent",
      description: `We've sent a verification code to ${formData.email}`,
    });
    
    setStep('verification');
  };

  const handleSubmitVerification = () => {
    const validationErrors = validateVerificationStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // In a real app, this would verify the code
    setStep('newPassword');
  };

  const handleSubmitNewPassword = () => {
    const validationErrors = validateNewPasswordStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // In a real app, this would reset the password
    toast({
      title: "Password reset successful",
      description: "Your password has been reset. You can now log in with your new password.",
    });
    
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Recover Password</h1>
            <p className="text-gray-600 text-center mb-8">Enter your email to receive a verification code</p>
            
            <div className="form-container">
              <AuthInput
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              
              <Button 
                type="button" 
                className="w-full mt-6"
                onClick={handleSubmitEmail}
              >
                Send Verification Code
              </Button>
            </div>
          </>
        );
      
      case 'verification':
        return (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Enter Verification Code</h1>
            <p className="text-gray-600 text-center mb-8">We've sent a 6-digit code to {formData.email}</p>
            
            <div className="form-container">
              <AuthInput
                id="verificationCode"
                label="Verification Code"
                type="text"
                value={formData.verificationCode}
                onChange={handleInputChange}
                error={errors.verificationCode}
                required
              />
              
              <div className="mt-2 flex justify-end">
                <button 
                  type="button"
                  onClick={handleSubmitEmail}
                  className="text-sm text-primary-600 font-medium"
                >
                  Resend Code
                </button>
              </div>
              
              <Button 
                type="button" 
                className="w-full mt-6"
                onClick={handleSubmitVerification}
              >
                Verify
              </Button>
            </div>
          </>
        );
      
      case 'newPassword':
        return (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Create New Password</h1>
            <p className="text-gray-600 text-center mb-8">Your identity has been verified. Set a new password.</p>
            
            <div className="form-container">
              <PasswordInput
                id="newPassword"
                label="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword}
                required
              />
              
              <PasswordInput
                id="confirmPassword"
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
              />
              
              <Button 
                type="button" 
                className="w-full mt-6"
                onClick={handleSubmitNewPassword}
              >
                Reset Password
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen p-6 screen-fade-in">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            if (step === 'email') {
              navigate('/login');
            } else if (step === 'verification') {
              setStep('email');
            } else if (step === 'newPassword') {
              setStep('verification');
            }
          }}
          className="mr-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Logo size="sm" />
        <div className="ml-auto w-8"></div> {/* For balance */}
      </div>
      
      {renderStep()}
    </div>
  );
};

export default PasswordRecoveryScreen;
