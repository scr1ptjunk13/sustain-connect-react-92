
import React from 'react';
import { Bell, Settings, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useWebSocketFallback } from '@/hooks/useWebSocketFallback';

const NotificationCenter: React.FC = () => {
  const { 
    isSupported, 
    isSubscribed, 
    requestPermission, 
    subscribe, 
    unsubscribe,
    sendTestNotification,
    hasRealTimeSupport
  } = usePushNotifications();
  
  const { isConnected: wsConnected } = useWebSocketFallback();

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

  const getConnectionStatus = () => {
    if (isSubscribed) return { status: 'Push Enabled', icon: Bell, color: 'text-green-600' };
    if (wsConnected) return { status: 'Real-time', icon: Wifi, color: 'text-blue-600' };
    return { status: 'Offline', icon: WifiOff, color: 'text-red-600' };
  };

  const { status, icon: StatusIcon, color } = getConnectionStatus();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasRealTimeSupport && (
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
              <div className="flex items-center space-x-2">
                <StatusIcon className={`h-4 w-4 ${color}`} />
                <span className="text-sm font-medium">{status}</span>
              </div>
              <Badge variant={hasRealTimeSupport ? "default" : "secondary"}>
                {hasRealTimeSupport ? "Active" : "Inactive"}
              </Badge>
            </div>

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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  Push notifications not supported. Using real-time fallback.
                </p>
              </div>
            )}
            
            {wsConnected && !isSubscribed && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  Connected via WebSocket for real-time updates
                </p>
              </div>
            )}
            
            {(isSubscribed || wsConnected) && (
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
              <li>• Automated reminders</li>
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
