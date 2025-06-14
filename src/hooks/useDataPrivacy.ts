
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface DataExportRequest {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  expires_at?: string;
  created_at: string;
}

interface DataDeletionRequest {
  id: string;
  user_id: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  scheduled_deletion_at?: string;
  created_at: string;
}

export const useDataPrivacy = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const requestDataExport = async () => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('data-export', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      toast({
        title: "Data Export Requested",
        description: "Your data export request has been submitted. You'll receive an email when it's ready."
      });

      return true;
    } catch (error: any) {
      console.error('Error requesting data export:', error);
      toast({
        title: "Error",
        description: "Failed to request data export",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestDataDeletion = async (reason?: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('data-deletion', {
        body: { user_id: user.id, reason }
      });

      if (error) throw error;

      toast({
        title: "Data Deletion Requested",
        description: "Your data deletion request has been submitted and will be reviewed."
      });

      return true;
    } catch (error: any) {
      console.error('Error requesting data deletion:', error);
      toast({
        title: "Error",
        description: "Failed to request data deletion",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacyConsent = async (consents: Record<string, boolean>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('privacy_consents')
        .upsert({
          user_id: user.id,
          marketing_consent: consents.marketing || false,
          analytics_consent: consents.analytics || false,
          data_sharing_consent: consents.dataSharing || false,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved"
      });

      return true;
    } catch (error: any) {
      console.error('Error updating privacy consent:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    loading,
    requestDataExport,
    requestDataDeletion,
    updatePrivacyConsent
  };
};
