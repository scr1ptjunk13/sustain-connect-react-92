
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, User, Clock, Mail, Phone } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const MessageCenter: React.FC = () => {
  const { messages, unreadCount, loading, sendMessage, markAsRead } = useMessaging();
  const { user } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    recipient: '',
    subject: '',
    content: ''
  });

  const handleSendMessage = async () => {
    if (!composeData.recipient || !composeData.content) return;

    const success = await sendMessage(
      composeData.recipient,
      composeData.content,
      composeData.subject || undefined
    );

    if (success) {
      setComposeData({ recipient: '', subject: '', content: '' });
      setShowCompose(false);
    }
  };

  const handleMessageClick = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.recipient_id === user?.id && !message.is_read) {
      markAsRead(messageId);
    }
    setSelectedMessage(messageId);
  };

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="h-8 w-8" />
            Message Center
          </h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="mt-2">
              {unreadCount} unread messages
            </Badge>
          )}
        </div>
        <Button onClick={() => setShowCompose(true)}>
          <Send className="h-4 w-4 mr-2" />
          Compose Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {loading ? (
                <div className="p-4 text-center">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No messages found
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message.id)}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedMessage === message.id ? 'bg-blue-50' : ''
                      } ${
                        !message.is_read && message.recipient_id === user?.id 
                          ? 'bg-blue-25 font-medium' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {message.sender?.full_name || 'Unknown User'}
                            </span>
                            {!message.is_read && message.recipient_id === user?.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          {message.subject && (
                            <p className="text-sm font-medium mt-1">
                              {message.subject}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground truncate">
                            {message.content}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(message.created_at), 'MMM d, HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedMessageData ? 'Message Details' : 'Select a Message'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessageData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        {selectedMessageData.sender?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessageData.sender?.role}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {selectedMessageData.message_type}
                  </Badge>
                </div>
                
                {selectedMessageData.subject && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium">Subject</h3>
                      <p className="text-sm mt-1">{selectedMessageData.subject}</p>
                    </div>
                  </>
                )}

                <Separator />
                
                <div>
                  <h3 className="font-medium">Message</h3>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessageData.content}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(new Date(selectedMessageData.created_at), 'MMMM d, yyyy at HH:mm')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                Select a message to view its details
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compose Message Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipient ID</label>
                <Input
                  placeholder="Enter recipient user ID"
                  value={composeData.recipient}
                  onChange={(e) => setComposeData(prev => ({ ...prev, recipient: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Subject (Optional)</label>
                <Input
                  placeholder="Message subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={composeData.content}
                  onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendMessage}
                  disabled={!composeData.recipient || !composeData.content}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline" onClick={() => setShowCompose(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MessageCenter;
