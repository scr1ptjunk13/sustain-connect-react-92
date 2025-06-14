
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface DeliveryAssignment {
  id: string;
  donation_id: string;
  delivery_person_id: string;
  ngo_id: string;
  status: string;
  delivery_address: string;
  pickup_scheduled_at: string;
  delivery_scheduled_at: string;
  notes: string;
  created_at: string;
  donation?: any;
  delivery_person?: { full_name: string; phone: string };
  ngo?: { full_name: string };
}

export const useDeliveryAssignments = () => {
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAssignments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('delivery-assignments', {
        method: 'GET'
      });

      if (error) throw error;
      setAssignments(data.assignments || []);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch delivery assignments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (assignmentData: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('delivery-assignments', {
        method: 'POST',
        body: assignmentData
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery assigned successfully!"
      });

      await fetchAssignments();
      return data.assignment;
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign delivery",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAssignmentStatus = async (assignmentId: string, status: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke(`delivery-assignments/${assignmentId}`, {
        method: 'PUT',
        body: { status }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Status updated successfully!"
      });

      await fetchAssignments();
      return data.assignment;
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
      return null;
    }
  };

  const findDeliveryPersonnel = async (lat: number, lng: number) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase.functions.invoke('find-delivery-personnel', {
        method: 'GET'
      });

      if (error) throw error;
      return data.personnel || [];
    } catch (error: any) {
      console.error('Error finding delivery personnel:', error);
      toast({
        title: "Error",
        description: "Failed to find delivery personnel",
        variant: "destructive"
      });
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  return {
    assignments,
    loading,
    fetchAssignments,
    createAssignment,
    updateAssignmentStatus,
    findDeliveryPersonnel
  };
};
