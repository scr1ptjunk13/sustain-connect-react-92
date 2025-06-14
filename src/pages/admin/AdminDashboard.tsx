
import React from 'react';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Truck, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { stats, loading } = useAdminDashboard();

  const growthData = [
    { month: 'Jan', users: 120, donations: 89, deliveries: 67 },
    { month: 'Feb', users: 145, donations: 123, deliveries: 89 },
    { month: 'Mar', users: 189, donations: 156, deliveries: 134 },
    { month: 'Apr', users: 234, donations: 198, deliveries: 167 },
    { month: 'May', users: 278, donations: 234, deliveries: 198 },
    { month: 'Jun', users: 312, donations: 267, deliveries: 223 }
  ];

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and manage your platform's performance
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} active this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalDonations}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.totalDeliveries}</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.pendingVerifications}</div>
                <p className="text-xs text-muted-foreground">
                  Require admin review
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
                      <Line type="monotone" dataKey="donations" stroke="#82ca9d" name="Donations" />
                      <Line type="monotone" dataKey="deliveries" stroke="#ffc658" name="Deliveries" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Monthly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="donations" fill="#8884d8" name="Donations" />
                      <Bar dataKey="deliveries" fill="#82ca9d" name="Deliveries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    stats.systemHealth === 'healthy' ? 'bg-green-100 text-green-600' :
                    stats.systemHealth === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Activity className="h-8 w-8" />
                  </div>
                  <p className="font-medium capitalize">{stats.systemHealth}</p>
                  <p className="text-sm text-muted-foreground">Overall Status</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-2 flex items-center justify-center">
                    <Users className="h-8 w-8" />
                  </div>
                  <p className="font-medium">99.9%</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 mx-auto mb-2 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <p className="font-medium">45ms</p>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </RoleProtectedRoute>
  );
};

export default AdminDashboard;
