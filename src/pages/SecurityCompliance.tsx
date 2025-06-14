
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SecurityDashboard from '@/components/security/SecurityDashboard';

const SecurityCompliance: React.FC = () => {
  return (
    <ProtectedRoute requireEmailVerification>
      <SecurityDashboard />
    </ProtectedRoute>
  );
};

export default SecurityCompliance;
