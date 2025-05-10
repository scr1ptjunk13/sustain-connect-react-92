
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Activity, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonorLayout from '@/components/donor/DonorLayout';
import StatCard from '@/components/donor/StatCard';
import DonationCard from '@/components/donor/DonationCard';

const DonorDashboard: React.FC = () => {
  // Mock data - would be replaced with actual data from an API
  const activeDonations = [
    {
      id: '123',
      title: 'Cooked Pasta',
      quantity: '5 kg',
      date: 'Today, 2:30 PM',
      status: 'pending' as const,
    },
    {
      id: '456',
      title: 'Fresh Vegetables',
      quantity: '3 kg',
      date: 'Yesterday, 10:00 AM',
      status: 'accepted' as const,
      ngo: 'Food For All'
    }
  ];

  return (
    <DonorLayout title="Donor Dashboard">
      <div className="mb-4 mt-3">
        <h2 className="text-lg font-semibold mb-3">Your Impact</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Donations Made"
            value="23"
            icon={<Coins className="h-5 w-5 text-primary-600" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Impact Generated"
            value="115 kg"
            icon={<Activity className="h-5 w-5 text-secondary-600" />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 mb-3">
        <h2 className="text-lg font-semibold">Active Donations</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to="/donor/donation-history">View All</Link>
        </Button>
      </div>

      {activeDonations.map(donation => (
        <DonationCard 
          key={donation.id}
          id={donation.id}
          title={donation.title}
          quantity={donation.quantity}
          date={donation.date}
          status={donation.status}
          ngo={donation.ngo}
        />
      ))}

      <Button 
        className="fixed bottom-20 right-4 rounded-full shadow-lg h-14 w-14 p-0"
        asChild
      >
        <Link to="/donor/create-donation">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create Donation</span>
        </Link>
      </Button>
    </DonorLayout>
  );
};

export default DonorDashboard;
