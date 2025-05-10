
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import AuthInput from '@/components/AuthInput';
import PasswordInput from '@/components/PasswordInput';
import Logo from '@/components/Logo';
import { toast } from '@/components/ui/use-toast';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // NGO specific
  orgName?: string;
  regNumber?: string;
  // Delivery specific
  vehicleType?: string;
  licenseNumber?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  orgName?: string;
  regNumber?: string;
  vehicleType?: string;
  licenseNumber?: string;
}

const RegistrationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Get user type from local storage
    const storedUserType = localStorage.getItem('userType');
    if (!storedUserType) {
      navigate('/select-role');
    } else {
      setUserType(storedUserType);
    }
  }, [navigate]);

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
    
    // Validate common fields
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Role-specific validations
    if (userType === 'ngo') {
      if (!formData.orgName) newErrors.orgName = 'Organization name is required';
      if (!formData.regNumber) newErrors.regNumber = 'Registration number is required';
    } else if (userType === 'delivery') {
      if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
      if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    }
    
    // Terms validation
    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Registration would happen here in a real app
    toast({
      title: "Registration successful!",
      description: `You've registered as a ${userType}. Please check your email to verify your account.`,
    });
    
    // Navigate to login
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const renderRoleSpecificFields = () => {
    if (userType === 'ngo') {
      return (
        <>
          <AuthInput
            id="orgName"
            label="Organization Name"
            type="text"
            value={formData.orgName || ''}
            onChange={handleInputChange}
            error={errors.orgName}
            required
          />
          <AuthInput
            id="regNumber"
            label="Registration Number"
            type="text"
            value={formData.regNumber || ''}
            onChange={handleInputChange}
            error={errors.regNumber}
            required
          />
        </>
      );
    } else if (userType === 'delivery') {
      return (
        <>
          <AuthInput
            id="vehicleType"
            label="Vehicle Type"
            type="text"
            value={formData.vehicleType || ''}
            onChange={handleInputChange}
            error={errors.vehicleType}
            required
          />
          <AuthInput
            id="licenseNumber"
            label="License Number"
            type="text"
            value={formData.licenseNumber || ''}
            onChange={handleInputChange}
            error={errors.licenseNumber}
            required
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6 screen-fade-in">
      <div className="flex items-center mb-6">
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
      
      <h1 className="text-2xl font-bold mb-1 text-center">Create Account</h1>
      <p className="text-gray-600 text-center mb-6">
        {userType === 'donor' && 'Join as a donor to help communities in need'}
        {userType === 'ngo' && 'Register your organization to receive donations'}
        {userType === 'delivery' && 'Sign up as delivery personnel to help distribute resources'}
      </p>
      
      <form onSubmit={handleSubmit} className="form-container">
        <AuthInput
          id="name"
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          required
        />
        
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />
        
        <AuthInput
          id="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          required
        />
        
        {/* Role-specific fields */}
        {renderRoleSpecificFields()}
        
        <PasswordInput
          id="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />
        
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          required
        />
        
        <div className="flex items-start space-x-2 mt-4">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms} 
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} 
          />
          <label 
            htmlFor="terms" 
            className="text-sm text-gray-600 leading-tight cursor-pointer"
          >
            I agree to the <span className="text-primary-600 font-medium">Terms of Service</span> and <span className="text-primary-600 font-medium">Privacy Policy</span>
          </label>
        </div>
        {errors.terms && <p className="text-destructive text-sm -mt-1">{errors.terms}</p>}
        
        <Button type="submit" className="w-full mt-6">
          Create Account
        </Button>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary-600 font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationScreen;
