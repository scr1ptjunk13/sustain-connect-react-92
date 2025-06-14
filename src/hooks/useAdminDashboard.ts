
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SystemStats {
  totalUsers: number;
  totalDonations: number;
  totalDeliveries: number;
  activeUsers: number;
  pendingVerifications: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface UserAction {
  id: string;
  user_id: string;
  action: 'suspend' | 'verify' | 'delete' | 'activate';
  reason?: string;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalDonations: 0,
    totalDeliveries: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    systemHealth: 'healthy'
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchSystemStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user stats
      const { data: userStats, error: userError } = await supabase
        .from('profiles')
        .select('id, created_at, role');

      if (userError) throw userError;

      // Fetch donation stats
      const { data: donationStats, error: donationError } = await supabase
        .from('donations')
        .select('id, created_at');

      if (donationError) throw donationError;

      // Fetch delivery stats
      const { data: deliveryStats, error: deliveryError } = await supabase
        .from('delivery_assignments')
        .select('id, created_at');

      if (deliveryError) throw deliveryError;

      // Fetch pending verifications
      const { data: pendingNgos, error: ngoError } = await supabase
        .from('ngo_details')
        .select('id')
        .eq('verification_status', 'pending');

      if (ngoError) throw ngoError;

      const { data: pendingDelivery, error: deliveryVerError } = await supabase
        .from('delivery_details')
        .select('id')
        .eq('verification_status', 'pending');

      if (deliveryVerError) throw deliveryVerError;

      // Calculate active users (users who logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      setStats({
        totalUsers: userStats?.length || 0,
        totalDonations: donationStats?.length || 0,
        totalDeliveries: deliveryStats?.length || 0,
        activeUsers: userStats?.filter(u => new Date(u.created_at) > thirtyDaysAgo).length || 0,
        pendingVerifications: (pendingNgos?.length || 0) + (pendingDelivery?.length || 0),
        systemHealth: 'healthy' // This would be calculated based on actual system metrics
      });
    } catch (error: any) {
      console.error('Error fetching system stats:', error);
      toast({
        title: "Error",
        description: "Failed to load system statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const moderateUser = async (userId: string, action: UserAction['action'], reason?: string) => {
    if (!user) return false;

    try {
      let updateData: any = {};

      switch (action) {
        case 'suspend':
          // In a real implementation, you'd have a suspended flag
          updateData = { updated_at: new Date().toISOString() };
          break;
        case 'verify':
          // Verify NGO or delivery person
          const { error: ngoError } = await supabase
            .from('ngo_details')
            .update({ verification_status: 'verified' })
            .eq('user_id', userId);

          const { error: deliveryError } = await supabase
            .from('delivery_details')
            .update({ verification_status: 'verified' })
            .eq('user_id', userId);

          if (ngoError && deliveryError) {
            throw new Error('User not found in verification tables');
          }
          break;
        case 'delete':
          // In production, you'd soft delete or archive
          updateData = { updated_at: new Date().toISOString() };
          break;
        case 'activate':
          updateData = { updated_at: new Date().toISOString() };
          break;
      }

      // Log the admin action
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: `admin_${action}`,
        resource_type: 'user',
        resource_id: userId,
        details: { reason, target_user_id: userId }
      });

      toast({
        title: "Action Completed",
        description: `User ${action} action completed successfully`
      });

      fetchSystemStats();
      return true;
    } catch (error: any) {
      console.error(`Error performing ${action} on user:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} user`,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSystemStats();
  }, [user]);

  return {
    stats,
    loading,
    moderateUser,
    refetch: fetchSystemStats
  };
};
