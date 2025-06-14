
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const NotificationCenter: React.FC = () => {
  const { 
    isSupported, 
    isSubscribed, 
    requestPermission, 
    subscribe, 
    unsubscribe,
    sendTestNotification 
  } = usePushNotifications();

  const handleToggleNotifications = async () => {
    if (!isSupported) return;

    if (!isSubscribed) {
      const granted = await requestPermission();
      if (granted) {
        await subscribe();
      }
    } else {
      await unsubscribe();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {isSubscribed && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              •
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Get updates about your deliveries
                </p>
              </div>
              <Button
                variant={isSubscribed ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleNotifications}
                disabled={!isSupported}
              >
                {isSubscribed ? "Disable" : "Enable"}
              </Button>
            </div>
            
            {!isSupported && (
              <p className="text-xs text-muted-foreground">
                Push notifications are not supported in this browser
              </p>
            )}
            
            {isSubscribed && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={sendTestNotification}
              >
                Send Test Notification
              </Button>
            )}
          </div>
          
          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground">
              You'll receive notifications for:
            </p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• Delivery status updates</li>
              <li>• New donation requests</li>
              <li>• Pickup confirmations</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
