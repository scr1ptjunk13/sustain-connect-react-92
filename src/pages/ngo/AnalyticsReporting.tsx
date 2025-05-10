
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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const monthlyData = [
  { name: 'Jan', value: 28 },
  { name: 'Feb', value: 35 },
  { name: 'Mar', value: 42 },
  { name: 'Apr', value: 38 },
  { name: 'May', value: 50 }
];

const foodTypeData = [
  { name: 'Vegetables', value: 35 },
  { name: 'Fruits', value: 20 },
  { name: 'Bakery', value: 15 },
  { name: 'Prepared', value: 25 },
  { name: 'Non-perishable', value: 5 }
];

const COLORS = ['#00aa48', '#0088cc', '#8884d8', '#ffc658', '#ff8042'];

const AnalyticsReporting: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  // Mock analytics data
  const analyticsData = {
    totalDonationsReceived: 215,
    totalWeightReceived: '842 kg',
    totalPeopleServed: 1245,
    averageDonationSize: '3.9 kg',
    topDonor: 'ABC Restaurant',
    topDonorContribution: '105 kg'
  };

  return (
    <NgoLayout title="Analytics & Reporting">
      <div className="py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Performance Dashboard</h2>
          <div className="flex gap-2">
            <Select 
              defaultValue="month" 
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm text-muted-foreground">Total Donations</CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-4">
              <p className="text-2xl font-bold">{analyticsData.totalDonationsReceived}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm text-muted-foreground">Total Weight</CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-4">
              <p className="text-2xl font-bold">{analyticsData.totalWeightReceived}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm text-muted-foreground">People Served</CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-4">
              <p className="text-2xl font-bold">{analyticsData.totalPeopleServed}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm text-muted-foreground">Avg. Donation</CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-4">
              <p className="text-2xl font-bold">{analyticsData.averageDonationSize}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center text-base">
              Donation Volume Trends
              <CircleHelp className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088cc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center text-base">
              Food Type Distribution
              <CircleHelp className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={foodTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {foodTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Contributors</CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="divide-y">
              <div className="px-6 py-3 flex justify-between">
                <div>
                  <p className="font-medium">ABC Restaurant</p>
                  <p className="text-sm text-muted-foreground">26 donations</p>
                </div>
                <p className="font-semibold">105 kg</p>
              </div>
              <div className="px-6 py-3 flex justify-between">
                <div>
                  <p className="font-medium">City Supermarket</p>
                  <p className="text-sm text-muted-foreground">18 donations</p>
                </div>
                <p className="font-semibold">87 kg</p>
              </div>
              <div className="px-6 py-3 flex justify-between">
                <div>
                  <p className="font-medium">Fresh Bakery</p>
                  <p className="text-sm text-muted-foreground">20 donations</p>
                </div>
                <p className="font-semibold">62 kg</p>
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
