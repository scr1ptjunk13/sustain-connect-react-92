
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Settings, Phone, Mail } from 'lucide-react';
import MessageCenter from '@/components/communication/MessageCenter';
import ChatInterface from '@/components/communication/ChatInterface';
import NotificationSettings from '@/components/communication/NotificationSettings';

const CommunicationCenter: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Communication Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <MessageCircle className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">Direct Messages</p>
              <p className="text-sm text-muted-foreground">Private messaging</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">Chat Rooms</p>
              <p className="text-sm text-muted-foreground">Group conversations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Mail className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">Email Alerts</p>
              <p className="text-sm text-muted-foreground">Automated notifications</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <Phone className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">SMS Updates</p>
              <p className="text-sm text-muted-foreground">Text notifications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="chat">Chat Rooms</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <MessageCenter />
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationCenter;
