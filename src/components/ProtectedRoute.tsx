
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireEmailVerification = false
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check email verification if required
  if (requireEmailVerification && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen p-6">
        <EmailVerificationBanner />
        <div className="text-center mt-8">
          <h2 className="text-xl font-semibold mb-2">Email Verification Required</h2>
          <p className="text-muted-foreground">
            Please verify your email address to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <EmailVerificationBanner />
      {children}
    </>
  );
};

export default ProtectedRoute;
