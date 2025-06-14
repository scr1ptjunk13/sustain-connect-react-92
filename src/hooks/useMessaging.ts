
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  message_type: 'direct' | 'support' | 'notification';
  is_read: boolean;
  created_at: string;
  sender?: {
    full_name: string;
    role: string;
  };
}

export const useMessaging = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedMessages: Message[] = (data || []).map(message => ({
        ...message,
        message_type: message.message_type as 'direct' | 'support' | 'notification',
        is_read: message.is_read || false,
        subject: message.subject || undefined
      }));

      setMessages(typedMessages);
      
      // Count unread messages
      const unread = typedMessages.filter(msg => 
        msg.recipient_id === user.id && !msg.is_read
      ).length;
      setUnreadCount(unread);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New message received:', payload);
          fetchMessages();
          toast({
            title: "New Message",
            description: "You have received a new message"
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (
    recipientId: string, 
    content: string, 
    subject?: string,
    messageType: 'direct' | 'support' | 'notification' = 'direct'
  ) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          subject,
          message_type: messageType
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully"
      });

      fetchMessages();
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking message as read:', error);
    }
  };

  return {
    messages,
    unreadCount,
    loading,
    sendMessage,
    markAsRead,
    refetch: fetchMessages
  };
};
