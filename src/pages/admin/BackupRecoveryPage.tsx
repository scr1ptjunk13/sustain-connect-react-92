
import React from 'react';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import BackupRecovery from '@/components/admin/BackupRecovery';

const BackupRecoveryPage: React.FC = () => {
  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <BackupRecovery />
      </AdminLayout>
    </RoleProtectedRoute>
  );
};

export default BackupRecoveryPage;
