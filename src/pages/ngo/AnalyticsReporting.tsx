
import React, { useState } from 'react';
import { 
  Filter, 
  Download,
  ChartBar,
  CircleHelp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NgoLayout from '@/components/ngo/NgoLayout';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';
import AdvancedFilters from '@/components/analytics/AdvancedFilters';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useExportManager } from '@/components/analytics/ExportManager';

const AnalyticsReporting: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const { data, loading } = useAnalytics('ngo');
  const { exportToCSV, exportToPDF } = useExportManager();
  const [activeFilters, setActiveFilters] = useState(0);
  
  // Mock analytics data (enhanced)
  const analyticsData = {
    totalDonationsReceived: data?.totalDonations || 215,
    totalWeightReceived: '842 kg',
    totalPeopleServed: 1245,
    averageDonationSize: '3.9 kg',
    topDonor: 'ABC Restaurant',
    topDonorContribution: '105 kg'
  };

  const handleFiltersChange = (filters: any) => {
    setActiveFilters(Object.values(filters).filter(v => v).length);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const exportData = {
      headers: ['Metric', 'Value', 'Period'],
      rows: [
        ['Total Donations', analyticsData.totalDonationsReceived, timeRange],
        ['Total Weight', analyticsData.totalWeightReceived, timeRange],
        ['People Served', analyticsData.totalPeopleServed, timeRange],
        ['Average Donation', analyticsData.averageDonationSize, timeRange]
      ],
      filename: `ngo-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}`
    };

    if (format === 'csv') {
      exportToCSV(exportData);
    } else {
      exportToPDF(exportData);
    }
  };

  // Mock chart data
  const timeSeriesData = [
    { name: 'Jan', donations: 28, deliveries: 25 },
    { name: 'Feb', donations: 35, deliveries: 32 },
    { name: 'Mar', donations: 42, deliveries: 38 },
    { name: 'Apr', donations: 38, deliveries: 35 },
    { name: 'May', donations: 50, deliveries: 47 }
  ];

  const distributionData = [
    { name: 'Vegetables', value: 35 },
    { name: 'Fruits', value: 20 },
    { name: 'Bakery', value: 15 },
    { name: 'Prepared', value: 25 },
    { name: 'Non-perishable', value: 5 }
  ];

  return (
    <NgoLayout title="Analytics & Reporting">
      <div className="py-4 space-y-6">
        {/* Enhanced filters */}
        <AdvancedFilters
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          activeFilters={activeFilters}
        />

        {/* Key metrics with enhanced cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <AnalyticsCard
            title="Total Donations"
            value={analyticsData.totalDonationsReceived}
            change={{ value: 12, type: 'increase', period: 'last month' }}
            icon={<ChartBar className="h-4 w-4" />}
          />
          <AnalyticsCard
            title="Total Weight"
            value={analyticsData.totalWeightReceived}
            change={{ value: 8, type: 'increase', period: 'last month' }}
            icon={<ChartBar className="h-4 w-4" />}
          />
          <AnalyticsCard
            title="People Served"
            value={analyticsData.totalPeopleServed}
            change={{ value: 15, type: 'increase', period: 'last month' }}
            icon={<ChartBar className="h-4 w-4" />}
          />
          <AnalyticsCard
            title="Avg. Donation"
            value={analyticsData.averageDonationSize}
            change={{ value: 2, type: 'decrease', period: 'last month' }}
            icon={<ChartBar className="h-4 w-4" />}
          />
        </div>

        {/* Enhanced charts */}
        <AnalyticsCharts
          timeSeriesData={timeSeriesData}
          distributionData={distributionData}
          comparisonData={[
            { name: 'This Month', completed: 47, pending: 3, cancelled: 0 },
            { name: 'Last Month', completed: 35, pending: 2, cancelled: 1 }
          ]}
        />
        
        {/* Enhanced top contributors */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              Top Contributors
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('csv')}
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="divide-y">
              <div className="px-6 py-3 flex justify-between">
                <div>
                  <p className="font-medium">ABC Restaurant</p>
                  <p className="text-sm text-muted-foreground">26 donations • 15% increase</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">105 kg</p>
                  <p className="text-xs text-green-600">+12 kg</p>
                </div>
              </div>
              <div className="px-6 py-3 flex justify-between">
                <div>
                  <p className="font-medium">City Supermarket</p>
                  <p className="text-sm text-muted-foreground">18 donations • 8% increase</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">87 kg</p>
                  <p className="text-xs text-green-600">+6 kg</p>
                </div>
              </div>
              <div className="px-6 py-3 flex justify-between">
                <div>
                  <p className="font-medium">Fresh Bakery</p>
                  <p className="text-sm text-muted-foreground">20 donations • 25% increase</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">62 kg</p>
                  <p className="text-xs text-green-600">+12 kg</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-3 justify-center">
            <Button variant="ghost" size="sm">View All Contributors</Button>
          </CardFooter>
        </Card>
      </div>
    </NgoLayout>
  );
};

export default AnalyticsReporting;
