
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ScheduledNotification {
  id: string;
  type: 'delivery_reminder' | 'pickup_reminder' | 'status_update';
  scheduledFor: Date;
  delivered: boolean;
  data: any;
}

export const useNotificationScheduler = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Set up periodic check for scheduled notifications
      const interval = setInterval(checkScheduledNotifications, 60000); // Check every minute
      
      // Check immediately
      checkScheduledNotifications();
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const checkScheduledNotifications = async () => {
    const now = new Date();
    const pendingNotifications = scheduledNotifications.filter(
      notification => !notification.delivered && notification.scheduledFor <= now
    );

    for (const notification of pendingNotifications) {
      await deliverNotification(notification);
    }
  };

  const deliverNotification = async (notification: ScheduledNotification) => {
    try {
      // Send push notification if supported
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          // Send to push notification service
          await sendPushNotification(notification, subscription);
        }
      }

      // Mark as delivered
      setScheduledNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, delivered: true } : n
        )
      );

      // Show local notification
      showLocalNotification(notification);

    } catch (error) {
      console.error('Failed to deliver notification:', error);
    }
  };

  const sendPushNotification = async (notification: ScheduledNotification, subscription: PushSubscription) => {
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          subscription,
          notification: {
            title: getNotificationTitle(notification.type),
            body: getNotificationBody(notification.type, notification.data),
            data: notification.data
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  const showLocalNotification = (notification: ScheduledNotification) => {
    const title = getNotificationTitle(notification.type);
    const body = getNotificationBody(notification.type, notification.data);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: notification.data
      });
    } else {
      toast({
        title,
        description: body
      });
    }
  };

  const getNotificationTitle = (type: string): string => {
    switch (type) {
      case 'delivery_reminder':
        return 'Delivery Reminder';
      case 'pickup_reminder':
        return 'Pickup Reminder';
      case 'status_update':
        return 'Delivery Update';
      default:
        return 'SustainConnect';
    }
  };

  const getNotificationBody = (type: string, data: any): string => {
    switch (type) {
      case 'delivery_reminder':
        return `Your delivery to ${data.address} is scheduled for ${data.time}`;
      case 'pickup_reminder':
        return `Don't forget to pickup your donation from ${data.address}`;
      case 'status_update':
        return `Your delivery status has been updated to: ${data.status}`;
      default:
        return 'You have a new update';
    }
  };

  const scheduleNotification = (
    type: ScheduledNotification['type'],
    scheduledFor: Date,
    data: any
  ) => {
    const notification: ScheduledNotification = {
      id: `notification_${Date.now()}_${Math.random()}`,
      type,
      scheduledFor,
      delivered: false,
      data
    };

    setScheduledNotifications(prev => [...prev, notification]);
    
    console.log('Notification scheduled:', notification);
  };

  const scheduleDeliveryReminder = (deliveryId: string, scheduledTime: Date, address: string) => {
    const reminderTime = new Date(scheduledTime.getTime() - 30 * 60 * 1000); // 30 minutes before
    scheduleNotification('delivery_reminder', reminderTime, {
      deliveryId,
      time: scheduledTime.toLocaleTimeString(),
      address
    });
  };

  const schedulePickupReminder = (donationId: string, address: string) => {
    const reminderTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    scheduleNotification('pickup_reminder', reminderTime, {
      donationId,
      address
    });
  };

  const scheduleStatusUpdate = (deliveryId: string, status: string) => {
    scheduleNotification('status_update', new Date(), {
      deliveryId,
      status
    });
  };

  return {
    scheduledNotifications: scheduledNotifications.filter(n => !n.delivered),
    scheduleDeliveryReminder,
    schedulePickupReminder,
    scheduleStatusUpdate,
    scheduleNotification
  };
};
