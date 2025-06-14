
import React from 'react';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import SystemMonitoring from '@/components/admin/SystemMonitoring';

const SystemMonitoringPage: React.FC = () => {
  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <SystemMonitoring />
      </AdminLayout>
    </RoleProtectedRoute>
  );
};

export default SystemMonitoringPage;
