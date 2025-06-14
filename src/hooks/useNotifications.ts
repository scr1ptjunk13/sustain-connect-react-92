
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  delivery_updates: boolean;
  donation_updates: boolean;
  marketing: boolean;
}

export const useNotifications = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences
        await createDefaultPreferences();
      }
    } catch (error: any) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    if (!user) return;

    const defaultPrefs = {
      user_id: user.id,
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      in_app_enabled: true,
      delivery_updates: true,
      donation_updates: true,
      marketing: false
    };

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert(defaultPrefs)
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
    } catch (error: any) {
      console.error('Error creating default preferences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return false;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved"
      });
      return true;
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive"
      });
      return false;
    }
  };

  const sendNotification = async (
    type: 'email' | 'sms',
    recipient: string,
    subject: string,
    content: string
  ) => {
    try {
      const functionName = type === 'email' ? 'send-email' : 'send-sms';
      const payload = type === 'email' 
        ? { to: recipient, subject, html: content }
        : { to: recipient, message: content };

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) throw error;

      // Log to notification history
      await supabase
        .from('notification_history')
        .insert({
          user_id: user?.id || '',
          notification_type: type,
          subject,
          content,
          status: 'sent',
          external_id: data?.messageId
        });

      return data;
    } catch (error: any) {
      console.error(`Error sending ${type} notification:`, error);
      
      // Log failed notification
      await supabase
        .from('notification_history')
        .insert({
          user_id: user?.id || '',
          notification_type: type,
          subject,
          content,
          status: 'failed'
        });
      
      throw error;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    sendNotification,
    refetch: fetchPreferences
  };
};
