
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataDeletionRequest {
  user_id: string;
  reason?: string;
}

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

    const { reason }: DataDeletionRequest = await req.json();

    // Create deletion request record
    const { data: deletionRecord, error: deletionError } = await supabase
      .from('data_deletion_requests')
      .insert({
        user_id: user.id,
        reason: reason || 'No reason provided',
        status: 'pending',
        scheduled_deletion_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days grace period
      })
      .select()
      .single();

    if (deletionError) throw deletionError;

    // Send confirmation email
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          subject: 'Account Deletion Request Submitted',
          html: `
            <h2>Account Deletion Request</h2>
            <p>We've received your request to delete your account.</p>
            <p>Your account is scheduled for deletion in 30 days as required by our data retention policy.</p>
            <p>If you change your mind, you can cancel this request by logging into your account.</p>
            <p>Request ID: ${deletionRecord.id}</p>
            <p>Reason provided: ${reason || 'No reason provided'}</p>
          `,
          type: 'general'
        }
      });
    } catch (emailError) {
      console.warn('Failed to send email notification:', emailError);
    }

    console.log(`Data deletion requested for user: ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletion_id: deletionRecord.id,
        message: 'Account deletion request submitted. You have 30 days to cancel if you change your mind.'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in data-deletion function:', error);
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
