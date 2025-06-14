
import React from 'react';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';

const UserManagementPage: React.FC = () => {
  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <UserManagement />
      </AdminLayout>
    </RoleProtectedRoute>
  );
};

export default UserManagementPage;
