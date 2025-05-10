
import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Users, 
  Clock, 
  Check,
  CheckCircle,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import NgoLayout from '@/components/ngo/NgoLayout';

const DistributionManagement: React.FC = () => {
  const [view, setView] = useState<'inventory' | 'distribution'>('inventory');
  
  // Mock data for inventory items
  const inventoryItems = [
    {
      id: '123',
      name: 'Fresh Vegetables',
      quantity: '12 kg',
      category: 'Vegetables',
      dateReceived: 'May 9, 2025',
      expiryDate: 'May 12, 2025',
      status: 'available'
    },
    {
      id: '456',
      name: 'Bread and Pastries',
      quantity: '8 kg',
      category: 'Bakery',
      dateReceived: 'May 9, 2025',
      expiryDate: 'May 10, 2025',
      status: 'available'
    },
    {
      id: '789',
      name: 'Canned Goods',
      quantity: '24 items',
      category: 'Non-perishable',
      dateReceived: 'May 8, 2025',
      expiryDate: 'Dec 10, 2025',
      status: 'available'
    },
    {
      id: '101',
      name: 'Cooked Meals',
      quantity: '15 portions',
      category: 'Prepared',
      dateReceived: 'May 9, 2025',
      expiryDate: 'May 10, 2025',
      status: 'allocated',
      allocatedTo: 'Shelter A'
    }
  ];
  
  // Mock data for beneficiary groups
  const beneficiaryGroups = [
    {
      id: '1',
      name: 'Downtown Shelter',
      people: 45,
      lastDistribution: '2 days ago'
    },
    {
      id: '2',
      name: 'Family Support Center',
      people: 32,
      lastDistribution: '1 week ago'
    },
    {
      id: '3',
      name: 'Youth Community',
      people: 18,
      lastDistribution: 'Today'
    },
    {
      id: '4',
      name: 'Senior Care Facility',
      people: 27,
      lastDistribution: '3 days ago'
    }
  ];

  const SummaryStats = () => (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">Available Inventory</p>
          <p className="text-xl font-bold">43.5 kg</p>
        </div>
        <div className="p-2 bg-green-50 rounded-full">
          <LayoutGrid className="h-5 w-5 text-green-600" />
        </div>
      </div>
      <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">People Served Today</p>
          <p className="text-xl font-bold">122</p>
        </div>
        <div className="p-2 bg-secondary/10 rounded-full">
          <Users className="h-5 w-5 text-secondary" />
        </div>
      </div>
    </div>
  );

  const InventoryView = () => (
    <>
      <SummaryStats />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Inventory</h2>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="bakery">Bakery</SelectItem>
              <SelectItem value="prepared">Prepared</SelectItem>
              <SelectItem value="non-perishable">Non-perishable</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {inventoryItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between mb-1">
              <h3 className="font-medium">{item.name}</h3>
              {item.status === 'available' ? (
                <Badge variant="default" className="bg-green-600">Available</Badge>
              ) : (
                <Badge variant="secondary">Allocated</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{item.quantity} • {item.category}</p>
            
            <div className="grid grid-cols-2 gap-x-4 mt-3 text-xs text-muted-foreground">
              <div>
                <p>Received: {item.dateReceived}</p>
              </div>
              <div>
                <p>Expires: {item.expiryDate}</p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t flex justify-between">
              {item.status === 'allocated' ? (
                <span className="text-xs text-secondary flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  Allocated to: {item.allocatedTo}
                </span>
              ) : (
                <span></span>
              )}
              <Button size="sm" className="text-xs h-7">
                Distribute
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const DistributionView = () => (
    <>
      <SummaryStats />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Beneficiary Groups</h2>
        <Button size="sm" variant="outline" className="text-xs h-8 flex items-center">
          <Plus className="h-3.5 w-3.5 mr-1" />
          New Group
        </Button>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          className="pl-9"
        />
      </div>
      
      <div className="space-y-3">
        {beneficiaryGroups.map(group => (
          <Card key={group.id}>
            <CardHeader className="py-4">
              <CardTitle className="text-base flex justify-between">
                <span>{group.name}</span>
                <span className="text-sm font-normal flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.people} people
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="py-0 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Last distribution: {group.lastDistribution}
              </div>
            </CardContent>
            
            <CardFooter className="py-3 pt-4 flex justify-between">
              <Button variant="outline" size="sm" className="text-xs">View History</Button>
              <Button size="sm" className="text-xs">Plan Distribution</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );

  return (
    <NgoLayout title="Distribution Management">
      <div className="py-4">
        <div className="flex rounded-lg overflow-hidden border mb-4">
          <button 
            className={`flex-1 py-2 text-sm font-medium ${
              view === 'inventory' 
                ? 'bg-secondary text-white' 
                : 'bg-white text-muted-foreground'
            }`}
            onClick={() => setView('inventory')}
          >
            Inventory
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium ${
              view === 'distribution' 
                ? 'bg-secondary text-white' 
                : 'bg-white text-muted-foreground'
            }`}
            onClick={() => setView('distribution')}
          >
            Distribution
          </button>
        </div>
        
        {view === 'inventory' ? <InventoryView /> : <DistributionView />}
      </div>
    </NgoLayout>
  );
};

export default DistributionManagement;
