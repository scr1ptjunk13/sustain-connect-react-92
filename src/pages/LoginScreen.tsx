
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to appropriate dashboard
    if (user) {
      redirectToDashboard();
    }
  }, [user, navigate]);

  const redirectToDashboard = async () => {
    if (!user) return;
    
    try {
      // Get user profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role) {
        switch (profile.role) {
          case 'donor':
            navigate('/donor/dashboard');
            break;
          case 'ngo':
            navigate('/ngo/dashboard');
            break;
          case 'delivery':
            navigate('/delivery/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen p-6 screen-fade-in">
      <LoginHeader />
      <LoginForm />
    </div>
  );
};

export default LoginScreen;
