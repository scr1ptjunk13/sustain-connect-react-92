
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ChatRoom {
  id: string;
  name: string;
  room_type: 'general' | 'support' | 'delivery' | 'donation';
  created_by: string;
  is_active: boolean;
  created_at: string;
  participants?: ChatParticipant[];
}

interface ChatParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  user?: {
    full_name: string;
    role: string;
  };
}

interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  created_at: string;
  sender?: {
    full_name: string;
    role: string;
  };
}

export const useChat = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  useEffect(() => {
    if (currentRoom) {
      fetchMessages(currentRoom.id);
      subscribeToMessages(currentRoom.id);
    }
  }, [currentRoom]);

  const fetchRooms = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          participants:chat_participants(
            id,
            room_id,
            user_id,
            joined_at,
            last_read_at
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      setRooms(data || []);
    } catch (error: any) {
      console.error('Error fetching chat rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          room_id,
          sender_id,
          content,
          message_type,
          created_at
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = (roomId: string) => {
    const channel = supabase
      .channel(`chat_messages_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          fetchMessages(roomId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (roomId: string, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: user.id,
          content,
          message_type: 'text'
        });

      if (error) throw error;

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

  const createRoom = async (name: string, roomType: 'general' | 'support' | 'delivery' | 'donation') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          room_type: roomType,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as participant
      await supabase
        .from('chat_participants')
        .insert({
          room_id: data.id,
          user_id: user.id
        });

      fetchRooms();
      return data;
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive"
      });
      return null;
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_participants')
        .insert({
          room_id: roomId,
          user_id: user.id
        });

      if (error) throw error;

      fetchRooms();
      return true;
    } catch (error: any) {
      console.error('Error joining room:', error);
      return false;
    }
  };

  return {
    rooms,
    currentRoom,
    messages,
    loading,
    setCurrentRoom,
    sendMessage,
    createRoom,
    joinRoom,
    refetch: fetchRooms
  };
};
