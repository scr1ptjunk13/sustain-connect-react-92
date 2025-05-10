
import React from 'react';
import { Share, Award, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonorLayout from '@/components/donor/DonorLayout';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

// Mock data for charts
const monthlyData = [
  { name: 'Jan', value: 15 },
  { name: 'Feb', value: 22 },
  { name: 'Mar', value: 18 },
  { name: 'Apr', value: 25 },
  { name: 'May', value: 32 }
];

const ImpactDashboard: React.FC = () => {
  const { toast } = useToast();
  
  // Mock impact data
  const impactStats = {
    mealsDonated: 275,
    co2Saved: 85,
    donationsCompleted: 23,
    organizationsHelped: 8
  };

  // Badges/achievements
  const badges = [
    { id: 1, name: 'First Donation', description: 'Made your first food donation', earned: true },
    { id: 2, name: '10 Donations', description: 'Completed 10 food donations', earned: true },
    { id: 3, name: '25 Donations', description: 'Completed 25 food donations', earned: false },
    { id: 4, name: 'Zero Waste Hero', description: 'Saved 50kg of food from waste', earned: true },
    { id: 5, name: 'Community Champion', description: 'Donated to 5 different organizations', earned: true }
  ];

  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast({
      title: "Share Feature",
      description: "Your impact certificate has been shared."
    });
  };

  return (
    <DonorLayout title="Your Impact">
      <div className="py-4">
        <div className="mb-6">
          <div className="bg-primary-50 rounded-lg p-5 border border-primary-100">
            <h2 className="text-xl font-semibold text-center mb-3">Your Contribution</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-primary">{impactStats.mealsDonated}</p>
                <p className="text-sm text-muted-foreground">Meals Donated</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-secondary">{impactStats.co2Saved} kg</p>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-primary-600">{impactStats.donationsCompleted}</p>
                <p className="text-sm text-muted-foreground">Donations Made</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-secondary-600">{impactStats.organizationsHelped}</p>
                <p className="text-sm text-muted-foreground">NGOs Helped</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4 bg-white"
              onClick={handleShare}
            >
              <Share className="h-4 w-4 mr-2" />
              Share Your Impact
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Monthly Impact</h2>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
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
                  <Bar dataKey="value" fill="#00aa48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Meals provided per month
            </p>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Achievements</h2>
            <Award className="h-5 w-5 text-amber-500" />
          </div>
          
          <div className="space-y-3">
            {badges.map(badge => (
              <div 
                key={badge.id}
                className={`flex items-center p-3 rounded-lg border ${
                  badge.earned ? 'bg-white' : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  badge.earned ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Award className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
                {badge.earned && (
                  <div className="ml-auto">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DonorLayout>
  );
};

export default ImpactDashboard;
