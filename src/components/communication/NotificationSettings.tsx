
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings, Mail, MessageSquare, Smartphone, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationSettings: React.FC = () => {
  const { preferences, loading, updatePreferences } = useNotifications();

  const handleToggle = (key: string, value: boolean) => {
    updatePreferences({ [key]: value });
  };

  if (loading || !preferences) {
    return <div>Loading notification settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Channels */}
        <div>
          <h3 className="font-medium mb-4">Notification Channels</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.email_enabled}
                onCheckedChange={(checked) => handleToggle('email_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.sms_enabled}
                onCheckedChange={(checked) => handleToggle('sms_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.push_enabled}
                onCheckedChange={(checked) => handleToggle('push_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Show notifications within the app
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.in_app_enabled}
                onCheckedChange={(checked) => handleToggle('in_app_enabled', checked)}
              />
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="font-medium mb-4">Notification Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delivery Updates</p>
                <p className="text-sm text-muted-foreground">
                  Status updates for your deliveries
                </p>
              </div>
              <Switch
                checked={preferences.delivery_updates}
                onCheckedChange={(checked) => handleToggle('delivery_updates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Donation Updates</p>
                <p className="text-sm text-muted-foreground">
                  Updates about your donations
                </p>
              </div>
              <Switch
                checked={preferences.donation_updates}
                onCheckedChange={(checked) => handleToggle('donation_updates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing & Promotions</p>
                <p className="text-sm text-muted-foreground">
                  Newsletter and promotional content
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) => handleToggle('marketing', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
