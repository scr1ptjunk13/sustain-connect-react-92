
import React from 'react';
import { AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const EmailVerificationBanner: React.FC = () => {
  const { user } = useAuth();
  const { resendVerificationEmail } = useProfile();

  if (!user || user.email_confirmed_at) {
    return null;
  }

  const handleResendEmail = () => {
    resendVerificationEmail();
  };

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-orange-800">
          Please verify your email address to access all features.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendEmail}
          className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          <Mail className="h-4 w-4 mr-2" />
          Resend Email
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default EmailVerificationBanner;
