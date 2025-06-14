
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  totalDonations: number;
  completedDeliveries: number;
  activeUsers: number;
  avgDeliveryTime: number;
  successRate: number;
  recentActivity: any[];
  timeSeriesData: any[];
  distributionData: any[];
  performanceMetrics: any[];
}

export const useAnalytics = (userRole?: string) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAnalytics = async (filters?: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch donations data
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select(`
          *,
          profiles!donations_donor_id_fkey(full_name),
          profiles!donations_claimed_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (donationsError) throw donationsError;

      // Fetch delivery assignments
      const { data: deliveries, error: deliveriesError } = await supabase
        .from('delivery_assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (deliveriesError) throw deliveriesError;

      // Process analytics data
      const analytics: AnalyticsData = {
        totalDonations: donations?.length || 0,
        completedDeliveries: deliveries?.filter(d => d.status === 'completed').length || 0,
        activeUsers: 0, // Would need user activity tracking
        avgDeliveryTime: calculateAverageDeliveryTime(deliveries || []),
        successRate: calculateSuccessRate(deliveries || []),
        recentActivity: donations?.slice(0, 10) || [],
        timeSeriesData: generateTimeSeriesData(donations || []),
        distributionData: generateDistributionData(donations || []),
        performanceMetrics: generatePerformanceMetrics(deliveries || [])
      };

      setData(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageDeliveryTime = (deliveries: any[]) => {
    const completedDeliveries = deliveries.filter(d => 
      d.status === 'completed' && d.pickup_completed_at && d.delivery_completed_at
    );
    
    if (completedDeliveries.length === 0) return 0;
    
    const totalTime = completedDeliveries.reduce((sum, delivery) => {
      const pickup = new Date(delivery.pickup_completed_at).getTime();
      const delivery_time = new Date(delivery.delivery_completed_at).getTime();
      return sum + (delivery_time - pickup);
    }, 0);
    
    return Math.round(totalTime / completedDeliveries.length / (1000 * 60)); // minutes
  };

  const calculateSuccessRate = (deliveries: any[]) => {
    if (deliveries.length === 0) return 0;
    const completed = deliveries.filter(d => d.status === 'completed').length;
    return Math.round((completed / deliveries.length) * 100);
  };

  const generateTimeSeriesData = (donations: any[]) => {
    const monthlyData: { [key: string]: { donations: number; deliveries: number } } = {};
    
    donations.forEach(donation => {
      const month = new Date(donation.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { donations: 0, deliveries: 0 };
      }
      
      monthlyData[month].donations++;
      if (donation.status === 'delivered') {
        monthlyData[month].deliveries++;
      }
    });
    
    return Object.entries(monthlyData).map(([name, data]) => ({
      name,
      ...data
    }));
  };

  const generateDistributionData = (donations: any[]) => {
    const categories: { [key: string]: number } = {};
    
    donations.forEach(donation => {
      categories[donation.category] = (categories[donation.category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  const generatePerformanceMetrics = (deliveries: any[]) => {
    const avgTime = calculateAverageDeliveryTime(deliveries);
    const successRate = calculateSuccessRate(deliveries);
    
    return [
      {
        label: 'Average Delivery Time',
        value: avgTime,
        target: 60,
        unit: ' min',
        trend: avgTime <= 60 ? 'up' : 'down',
        status: avgTime <= 45 ? 'good' : avgTime <= 60 ? 'warning' : 'critical'
      },
      {
        label: 'Success Rate',
        value: successRate,
        target: 95,
        unit: '%',
        trend: successRate >= 90 ? 'up' : 'down',
        status: successRate >= 95 ? 'good' : successRate >= 85 ? 'warning' : 'critical'
      },
      {
        label: 'On-Time Deliveries',
        value: 87,
        target: 90,
        unit: '%',
        trend: 'stable',
        status: 'warning'
      }
    ];
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  return {
    data,
    loading,
    refetch: fetchAnalytics
  };
};
