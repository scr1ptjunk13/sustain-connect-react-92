
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'donor' | 'ngo' | 'delivery';
  created_at: string;
  updated_at: string;
}

interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdateData) => {
    if (!user) return { error: new Error('No user found') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...(updates.full_name && { full_name: updates.full_name }),
          ...(updates.phone && { phone: updates.phone }),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      await fetchProfile();
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return { error };
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return { error: new Error('No user email found') };

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "Verification email has been sent to your inbox"
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive"
      });
      return { error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    resendVerificationEmail,
    refetch: fetchProfile
  };
};
