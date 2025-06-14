
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

    // Create the helper functions for privacy consent management
    const functions = [
      {
        name: 'get_privacy_consents',
        sql: `
          CREATE OR REPLACE FUNCTION get_privacy_consents(p_user_id UUID)
          RETURNS TABLE(
            id UUID,
            user_id UUID,
            marketing_consent BOOLEAN,
            analytics_consent BOOLEAN,
            data_sharing_consent BOOLEAN,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ
          )
          LANGUAGE sql
          SECURITY DEFINER
          AS $$
            SELECT * FROM privacy_consents WHERE user_id = p_user_id;
          $$;
        `
      },
      {
        name: 'upsert_privacy_consents',
        sql: `
          CREATE OR REPLACE FUNCTION upsert_privacy_consents(
            p_user_id UUID,
            p_marketing_consent BOOLEAN,
            p_analytics_consent BOOLEAN,
            p_data_sharing_consent BOOLEAN
          )
          RETURNS VOID
          LANGUAGE sql
          SECURITY DEFINER
          AS $$
            INSERT INTO privacy_consents (user_id, marketing_consent, analytics_consent, data_sharing_consent, updated_at)
            VALUES (p_user_id, p_marketing_consent, p_analytics_consent, p_data_sharing_consent, now())
            ON CONFLICT (user_id) DO UPDATE SET
              marketing_consent = EXCLUDED.marketing_consent,
              analytics_consent = EXCLUDED.analytics_consent,
              data_sharing_consent = EXCLUDED.data_sharing_consent,
              updated_at = EXCLUDED.updated_at;
          $$;
        `
      }
    ];

    for (const func of functions) {
      const { error } = await supabase.rpc('exec_sql', { sql: func.sql });
      if (error) {
        console.error(`Error creating function ${func.name}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Privacy helper functions created' }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in privacy-helpers function:', error);
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
