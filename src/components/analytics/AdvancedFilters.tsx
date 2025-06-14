
import React, { useState } from 'react';
import { CalendarDays, Filter, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';

interface FilterState {
  search: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  status: string;
  category: string;
  location: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onExport: (format: 'csv' | 'pdf') => void;
  activeFilters: number;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  onExport,
  activeFilters
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: { from: null, to: null },
    status: '',
    category: '',
    location: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      dateRange: { from: null, to: null },
      status: '',
      category: '',
      location: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Filters & Export</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters}
                </Badge>
              )}
            </Button>
            <Select onValueChange={(format) => onExport(format as 'csv' | 'pdf')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or location..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => updateFilters('search', e.target.value)}
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <div className="space-y-2">
                <DatePicker
                  date={filters.dateRange.from}
                  onDateChange={(date) => updateFilters('dateRange', { ...filters.dateRange, from: date })}
                  placeholder="From date"
                />
                <DatePicker
                  date={filters.dateRange.to}
                  onDateChange={(date) => updateFilters('dateRange', { ...filters.dateRange, to: date })}
                  placeholder="To date"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => updateFilters('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(value) => updateFilters('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                placeholder="City or area"
                value={filters.location}
                onChange={(e) => updateFilters('location', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button variant="ghost" onClick={clearFilters} className="text-sm">
                Clear All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
