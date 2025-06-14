
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    // Collect all user data
    const userData: Record<string, any> = {};

    // Profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    userData.profile = profile;

    // Donations data
    const { data: donations } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', user.id);
    
    userData.donations = donations;

    // Messages data
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
    
    userData.messages = messages;

    // Notification preferences
    const { data: notifications } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id);
    
    userData.notification_preferences = notifications;

    // Privacy consents
    const { data: consents } = await supabase
      .from('privacy_consents')
      .select('*')
      .eq('user_id', user.id);
    
    userData.privacy_consents = consents;

    // Create data export record
    const { data: exportRecord, error: exportError } = await supabase
      .from('data_export_requests')
      .insert({
        user_id: user.id,
        status: 'completed',
        data: userData,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select()
      .single();

    if (exportError) throw exportError;

    // Send email notification (if email service is configured)
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          subject: 'Your Data Export is Ready',
          html: `
            <h2>Data Export Complete</h2>
            <p>Your personal data export has been completed and is available for download.</p>
            <p>Export ID: ${exportRecord.id}</p>
            <p>This export will expire in 7 days for security purposes.</p>
            <p>If you did not request this export, please contact support immediately.</p>
          `,
          type: 'general'
        }
      });
    } catch (emailError) {
      console.warn('Failed to send email notification:', emailError);
    }

    console.log(`Data export completed for user: ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        export_id: exportRecord.id,
        message: 'Data export completed. Check your email for download link.'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in data-export function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
