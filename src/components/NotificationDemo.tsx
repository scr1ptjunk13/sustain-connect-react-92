
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, Clock, Send, Zap } from 'lucide-react';

const NotificationDemo: React.FC = () => {
  const { 
    scheduleDeliveryReminder, 
    schedulePickupReminder, 
    scheduleStatusUpdate,
    scheduledNotifications 
  } = useNotificationScheduler();
  
  const { hasRealTimeSupport } = usePushNotifications();

  const handleScheduleDeliveryReminder = () => {
    const scheduledTime = new Date(Date.now() + 30 * 1000); // 30 seconds from now for demo
    scheduleDeliveryReminder('demo-delivery-123', scheduledTime, '123 Main St, Downtown');
  };

  const handleSchedulePickupReminder = () => {
    schedulePickupReminder('demo-donation-456', '789 Food Bank Ave');
  };

  const handleScheduleStatusUpdate = () => {
    scheduleStatusUpdate('demo-delivery-789', 'picked_up');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Demo
        </CardTitle>
        <CardDescription>
          Test the notification and scheduling system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Real-time Status</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            hasRealTimeSupport 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {hasRealTimeSupport ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Schedule Test Notifications:</h4>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleScheduleDeliveryReminder}
          >
            <Clock className="h-4 w-4 mr-2" />
            Delivery Reminder (30s)
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleSchedulePickupReminder}
          >
            <Clock className="h-4 w-4 mr-2" />
            Pickup Reminder (1h)
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleScheduleStatusUpdate}
          >
            <Send className="h-4 w-4 mr-2" />
            Status Update (Now)
          </Button>
        </div>

        {scheduledNotifications.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Pending Notifications:</h4>
            <div className="space-y-1">
              {scheduledNotifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="text-xs text-muted-foreground">
                  {notification.type} - {notification.scheduledFor.toLocaleTimeString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationDemo;
