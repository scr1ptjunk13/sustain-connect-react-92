
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Activity } from 'lucide-react';
import DataPrivacySettings from './DataPrivacySettings';
import AuditLogViewer from './AuditLogViewer';

const SecurityDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Security & Compliance</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Lock className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">Encrypted</p>
              <p className="text-sm text-muted-foreground">Data at rest</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Eye className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">GDPR Ready</p>
              <p className="text-sm text-muted-foreground">Privacy compliant</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Activity className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">Audit Logs</p>
              <p className="text-sm text-muted-foreground">Full tracking</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Shield className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">Rate Limited</p>
              <p className="text-sm text-muted-foreground">API protection</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="privacy">Data Privacy</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          <DataPrivacySettings />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
