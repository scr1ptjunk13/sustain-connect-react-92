
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
  lastMessage?: ChatMessage;
}

interface ChatParticipant {
  id: string;
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

export const useChat = (roomId?: string) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  useEffect(() => {
    if (roomId) {
      setCurrentRoom(rooms.find(room => room.id === roomId) || null);
      fetchMessages(roomId);
      subscribeToMessages(roomId);
    }
  }, [roomId, rooms]);

  const fetchRooms = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          participants:chat_participants(
            *,
            user:profiles!chat_participants_user_id_fkey(full_name, role)
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    if (!user || !roomId) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(full_name, role)
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
    if (!user || !roomId) return;

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
          console.log('New chat message:', payload);
          fetchMessages(roomId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createRoom = async (
    name: string, 
    roomType: 'general' | 'support' | 'delivery' | 'donation' = 'general',
    participantIds: string[] = []
  ) => {
    if (!user) return null;

    try {
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          room_type: roomType,
          created_by: user.id
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add creator as participant
      const participants = [user.id, ...participantIds];
      
      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert(
          participants.map(userId => ({
            room_id: room.id,
            user_id: userId
          }))
        );

      if (participantError) throw participantError;

      toast({
        title: "Chat Room Created",
        description: `Room "${name}" has been created successfully`
      });

      fetchRooms();
      return room;
    } catch (error: any) {
      console.error('Error creating chat room:', error);
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive"
      });
      return null;
    }
  };

  const sendMessage = async (roomId: string, content: string, messageType: 'text' | 'image' | 'file' | 'system' = 'text') => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: user.id,
          content,
          message_type: messageType
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

      toast({
        title: "Joined Room",
        description: "You have successfully joined the chat room"
      });

      fetchRooms();
      return true;
    } catch (error: any) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    rooms,
    messages,
    currentRoom,
    loading,
    createRoom,
    sendMessage,
    joinRoom,
    fetchRooms,
    fetchMessages: (id: string) => fetchMessages(id)
  };
};
