
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import DonorLayout from '@/components/donor/DonorLayout';
import DonationCard from '@/components/donor/DonationCard';

const DonationHistory: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Mock data - in a real app this would come from an API
  const donations = [
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
    },
    {
      id: '789',
      title: 'Bakery Items',
      quantity: '2 kg',
      date: 'May 5, 2025',
      status: 'in-transit' as const,
      ngo: 'Hunger Relief'
    },
    {
      id: '101',
      title: 'Canned Goods',
      quantity: '10 items',
      date: 'May 1, 2025',
      status: 'delivered' as const,
      ngo: 'Community Kitchen'
    },
    {
      id: '202',
      title: 'Rice and Beans',
      quantity: '4 kg',
      date: 'April 28, 2025',
      status: 'canceled' as const
    }
  ];

  const getFilteredDonations = () => {
    if (statusFilter === "all") return donations;
    return donations.filter(donation => donation.status === statusFilter);
  };

  const activeCount = donations.filter(d => ['pending', 'accepted', 'in-transit'].includes(d.status)).length;
  const completedCount = donations.filter(d => d.status === 'delivered').length;
  
  return (
    <DonorLayout title="Donation History">
      <div className="py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Donations</h2>
          
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <Select 
              onValueChange={setStatusFilter} 
              defaultValue="all"
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All ({donations.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {getFilteredDonations().length > 0 ? (
              getFilteredDonations().map(donation => (
                <DonationCard 
                  key={donation.id}
                  id={donation.id}
                  title={donation.title}
                  quantity={donation.quantity}
                  date={donation.date}
                  status={donation.status}
                  ngo={donation.ngo}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No donations found with the selected filter.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {donations
              .filter(d => ['pending', 'accepted', 'in-transit'].includes(d.status))
              .map(donation => (
                <DonationCard 
                  key={donation.id}
                  id={donation.id}
                  title={donation.title}
                  quantity={donation.quantity}
                  date={donation.date}
                  status={donation.status}
                  ngo={donation.ngo}
                />
              ))
            }
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {donations
              .filter(d => d.status === 'delivered')
              .map(donation => (
                <DonationCard 
                  key={donation.id}
                  id={donation.id}
                  title={donation.title}
                  quantity={donation.quantity}
                  date={donation.date}
                  status={donation.status}
                  ngo={donation.ngo}
                />
              ))
            }
          </TabsContent>
        </Tabs>
      </div>
    </DonorLayout>
  );
};

export default DonationHistory;
