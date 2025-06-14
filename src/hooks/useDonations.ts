
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface Donation {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  expiry_date: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_zip_code: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_date: string;
  pickup_time_start: string;
  pickup_time_end: string;
  contact_name: string;
  contact_phone: string;
  pickup_instructions: string;
  special_instructions: string;
  status: string;
  images: string[];
  created_at: string;
  donor?: { full_name: string; phone: string };
  claimed_by_profile?: { full_name: string };
}

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchDonations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('donations', {
        method: 'GET'
      });

      if (error) throw error;
      setDonations(data.donations || []);
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch donations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (donationData: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('donations', {
        method: 'POST',
        body: donationData
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Donation created successfully!"
      });

      await fetchDonations(); // Refresh the list
      return data.donation;
    } catch (error: any) {
      console.error('Error creating donation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create donation",
        variant: "destructive"
      });
      return null;
    }
  };

  const claimDonation = async (donationId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('donations', {
        method: 'PUT',
        body: { action: 'claim' }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Donation claimed successfully!"
      });

      await fetchDonations(); // Refresh the list
      return data.donation;
    } catch (error: any) {
      console.error('Error claiming donation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to claim donation",
        variant: "destructive"
      });
      return null;
    }
  };

  const uploadImage = async (file: File) => {
    if (!user) return null;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('upload-image', {
        method: 'POST',
        body: formData
      });

      if (error) throw error;
      return data.url;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  return {
    donations,
    loading,
    fetchDonations,
    createDonation,
    claimDonation,
    uploadImage
  };
};
