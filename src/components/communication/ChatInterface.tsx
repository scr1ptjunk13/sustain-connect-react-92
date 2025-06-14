
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Users, MessageCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const ChatInterface: React.FC = () => {
  const { rooms, currentRoom, messages, loading, setCurrentRoom, sendMessage, refetch } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    refetch();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentRoom) return;

    const success = await sendMessage(currentRoom.id, newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading chat...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      {/* Room List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Chat Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {rooms.map((room) => (
                <Button
                  key={room.id}
                  variant={currentRoom?.id === room.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setCurrentRoom(room)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{room.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {room.room_type}
                    </Badge>
                  </div>
                </Button>
              ))}
              {rooms.length === 0 && (
                <p className="text-muted-foreground text-sm">No chat rooms available</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {currentRoom ? currentRoom.name : 'Select a Chat Room'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          {currentRoom ? (
            <>
              <ScrollArea className="flex-1 mb-4 h-96">
                <div className="space-y-4 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a chat room to start messaging
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
