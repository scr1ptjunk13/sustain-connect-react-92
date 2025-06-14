
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';
import AdvancedFilters from '@/components/analytics/AdvancedFilters';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useExportManager } from '@/components/analytics/ExportManager';

const AdvancedAnalytics: React.FC = () => {
  const { data, loading, refetch } = useAnalytics();
  const { exportToCSV, exportToPDF } = useExportManager();
  const [activeFilters, setActiveFilters] = useState(0);

  const handleFiltersChange = (filters: any) => {
    // Count active filters
    const filterCount = Object.values(filters).filter(value => {
      if (typeof value === 'string') return value !== '';
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null);
      }
      return false;
    }).length;
    
    setActiveFilters(filterCount);
    // Apply filters to data
    refetch();
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const exportData = {
      headers: ['Date', 'Type', 'Status', 'Category', 'Location'],
      rows: data?.recentActivity.map(item => [
        new Date(item.created_at).toLocaleDateString(),
        'Donation',
        item.status,
        item.category,
        item.pickup_city
      ]) || [],
      filename: `analytics-report-${new Date().toISOString().split('T')[0]}`
    };

    if (format === 'csv') {
      exportToCSV(exportData);
    } else {
      exportToPDF(exportData);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
      </div>

      {/* Filters and Export */}
      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        activeFilters={activeFilters}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Donations"
          value={data?.totalDonations || 0}
          change={{ value: 12, type: 'increase', period: 'last month' }}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <AnalyticsCard
          title="Completed Deliveries"
          value={data?.completedDeliveries || 0}
          change={{ value: 8, type: 'increase', period: 'last month' }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <AnalyticsCard
          title="Active Users"
          value={data?.activeUsers || 145}
          change={{ value: 5, type: 'increase', period: 'last month' }}
          icon={<Users className="h-4 w-4" />}
        />
        <AnalyticsCard
          title="Avg Delivery Time"
          value={`${data?.avgDeliveryTime || 0} min`}
          change={{ value: 3, type: 'decrease', period: 'last month' }}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsCharts
            timeSeriesData={data?.timeSeriesData || []}
            distributionData={data?.distributionData || []}
            comparisonData={[
              { name: 'Jan', completed: 45, pending: 12, cancelled: 3, value: 60 },
              { name: 'Feb', completed: 52, pending: 8, cancelled: 2, value: 62 },
              { name: 'Mar', completed: 61, pending: 15, cancelled: 4, value: 80 },
              { name: 'Apr', completed: 58, pending: 10, cancelled: 1, value: 69 },
              { name: 'May', completed: 67, pending: 18, cancelled: 5, value: 90 }
            ]}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceMetrics
              title="Delivery Performance"
              metrics={data?.performanceMetrics || []}
            />
            <Card>
              <CardHeader>
                <CardTitle>Success Rate Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-green-600">
                    {data?.successRate || 0}%
                  </div>
                  <p className="text-muted-foreground">
                    Overall delivery success rate this month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Detailed trend analysis and forecasting will be displayed here.
              </p>
              {data?.timeSeriesData && (
                <AnalyticsCharts
                  timeSeriesData={data.timeSeriesData}
                  distributionData={[]}
                  comparisonData={[]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate custom reports with specific date ranges and filters.
                Use the export functionality above to download reports in CSV or PDF format.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
