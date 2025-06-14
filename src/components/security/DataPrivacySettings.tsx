
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash2, Shield, Eye } from 'lucide-react';
import { useDataPrivacy } from '@/hooks/useDataPrivacy';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PrivacyConsent {
  id: string;
  user_id: string;
  marketing_consent: boolean;
  analytics_consent: boolean;
  data_sharing_consent: boolean;
  created_at: string;
  updated_at: string;
}

const DataPrivacySettings: React.FC = () => {
  const { loading, requestDataExport, requestDataDeletion, updatePrivacyConsent } = useDataPrivacy();
  const { user } = useAuth();
  const [consents, setConsents] = useState({
    marketing: false,
    analytics: false,
    dataSharing: false
  });
  const [deletionReason, setDeletionReason] = useState('');

  useEffect(() => {
    fetchPrivacyConsents();
  }, [user]);

  const fetchPrivacyConsents = async () => {
    if (!user) return;

    try {
      // Use raw SQL to query privacy_consents table
      const { data, error } = await supabase
        .rpc('get_privacy_consents', { p_user_id: user.id });

      if (error) throw error;

      if (data && data.length > 0) {
        const consent = data[0];
        setConsents({
          marketing: consent.marketing_consent || false,
          analytics: consent.analytics_consent || false,
          dataSharing: consent.data_sharing_consent || false
        });
      }
    } catch (error) {
      console.error('Error fetching privacy consents:', error);
    }
  };

  const handleConsentChange = async (type: keyof typeof consents, value: boolean) => {
    const newConsents = { ...consents, [type]: value };
    setConsents(newConsents);
    await updatePrivacyConsent(newConsents);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Data Privacy & GDPR</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Consents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing">Marketing Communications</Label>
            <Switch
              id="marketing"
              checked={consents.marketing}
              onCheckedChange={(checked) => handleConsentChange('marketing', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="analytics">Analytics & Performance</Label>
            <Switch
              id="analytics"
              checked={consents.analytics}
              onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="dataSharing">Data Sharing with Partners</Label>
            <Switch
              id="dataSharing"
              checked={consents.dataSharing}
              onCheckedChange={(checked) => handleConsentChange('dataSharing', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Data Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={requestDataExport}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export My Data
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete My Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Your Account</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>This action will permanently delete your account and all associated data. This cannot be undone.</p>
                    <Textarea
                      placeholder="Please tell us why you're deleting your account (optional)"
                      value={deletionReason}
                      onChange={(e) => setDeletionReason(e.target.value)}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => requestDataDeletion(deletionReason)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPrivacySettings;
