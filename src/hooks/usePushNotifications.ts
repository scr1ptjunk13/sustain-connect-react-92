
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceWorker } from './useServiceWorker';
import { useWebSocketFallback } from './useWebSocketFallback';
import { toast } from '@/components/ui/use-toast';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [vapidKey, setVapidKey] = useState<string | null>(null);
  const { user } = useAuth();
  const { isRegistered, registration } = useServiceWorker();
  const { isConnected: wsConnected } = useWebSocketFallback();

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    
    // Fetch VAPID key from Supabase
    fetchVapidKey();
    
    // Check if user already has a subscription
    if (user && isSupported) {
      checkExistingSubscription();
    }
  }, [user, isSupported, isRegistered]);

  const fetchVapidKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-vapid-key');
      if (error) throw error;
      setVapidKey(data.vapidKey);
    } catch (error) {
      console.error('Error fetching VAPID key:', error);
      // Fallback to WebSocket notifications
      toast({
        title: "Push Setup",
        description: "Using real-time fallback for notifications",
      });
    }
  };

  const checkExistingSubscription = async () => {
    try {
      // Check database for existing subscription
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setIsSubscribed(true);
        // Try to get the current subscription from the browser
        if (registration) {
          const currentSub = await registration.pushManager.getSubscription();
          if (currentSub) {
            setSubscription(currentSub);
          }
        }
      }
    } catch (error: any) {
      console.error('Error checking existing subscription:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported. Using real-time fallback.",
        variant: "destructive"
      });
      return false;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      toast({
        title: "Notifications Enabled",
        description: "You'll receive real-time updates about your deliveries"
      });
      return true;
    } else {
      toast({
        title: "Permission Denied",
        description: "Using alternative notification methods",
        variant: "destructive"
      });
      return false;
    }
  };

  const subscribe = async () => {
    if (!isSupported || !user || !registration || !vapidKey) {
      toast({
        title: "Setup Required",
        description: "Push notification setup incomplete. Using fallback methods.",
        variant: "destructive"
      });
      return;
    }

    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      setSubscription(sub);
      setIsSubscribed(true);

      // Save subscription to database
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription: JSON.stringify(sub.toJSON()),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Subscribed",
        description: "You'll receive push notifications for delivery updates"
      });
    } catch (error: any) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Subscription Failed",
        description: "Using real-time fallback for notifications",
        variant: "destructive"
      });
    }
  };

  const unsubscribe = async () => {
    if (!subscription || !user) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      setIsSubscribed(false);

      // Remove subscription from database
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Unsubscribed",
        description: "Push notifications have been disabled"
      });
    } catch (error: any) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: "Error",
        description: "Failed to disable push notifications",
        variant: "destructive"
      });
    }
  };

  const sendTestNotification = () => {
    if (!isSupported) return;

    new Notification('Test Notification', {
      body: 'This is a test notification from SustainConnect',
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  };

  // Utility function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return {
    isSupported,
    isSubscribed: isSubscribed || wsConnected, // Consider WebSocket as backup
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    hasRealTimeSupport: isSubscribed || wsConnected
  };
};
