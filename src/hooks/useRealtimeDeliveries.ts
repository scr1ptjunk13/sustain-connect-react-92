
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface RealtimeDeliveryUpdate {
  id: string;
  status: string;
  current_location_lat?: number;
  current_location_lng?: number;
  updated_at: string;
  eta_minutes?: number;
}

export const useRealtimeDeliveries = () => {
  const [deliveries, setDeliveries] = useState<RealtimeDeliveryUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Subscribe to real-time updates for delivery assignments
    const channel = supabase
      .channel('delivery-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_assignments'
        },
        (payload) => {
          console.log('Real-time delivery update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            const updatedDelivery = payload.new as RealtimeDeliveryUpdate;
            
            setDeliveries(prev => 
              prev.map(delivery => 
                delivery.id === updatedDelivery.id 
                  ? { ...delivery, ...updatedDelivery }
                  : delivery
              )
            );

            // Show notification for status changes
            if (payload.old?.status !== updatedDelivery.status) {
              toast({
                title: "Delivery Update",
                description: `Delivery status changed to ${updatedDelivery.status}`,
              });
            }
          }
        }
      )
      .subscribe();

    setLoading(false);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateDeliveryLocation = async (
    deliveryId: string, 
    lat: number, 
    lng: number,
    etaMinutes?: number
  ) => {
    try {
      const { error } = await supabase
        .from('delivery_assignments')
        .update({
          current_location_lat: lat,
          current_location_lng: lng,
          eta_minutes: etaMinutes,
          updated_at: new Date().toISOString()
        })
        .eq('id', deliveryId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating delivery location:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery location",
        variant: "destructive"
      });
    }
  };

  return {
    deliveries,
    loading,
    updateDeliveryLocation
  };
};
