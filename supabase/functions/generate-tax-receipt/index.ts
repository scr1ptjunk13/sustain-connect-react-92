
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payment_id } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get payment details
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .select(`
        *,
        profiles(full_name, email)
      `)
      .eq('id', payment_id)
      .eq('status', 'completed')
      .single();

    if (paymentError || !payment) {
      throw new Error('Payment not found or not completed');
    }

    // Check if receipt already exists
    const { data: existingReceipt } = await supabaseClient
      .from('tax_receipts')
      .select('*')
      .eq('payment_id', payment_id)
      .single();

    if (existingReceipt) {
      return new Response(JSON.stringify({ receipt: existingReceipt }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Generate new tax receipt
    const receiptData = {
      payment_id: payment.id,
      user_id: payment.user_id,
      amount: payment.amount,
      currency: payment.currency,
      receipt_number: `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      issued_date: new Date().toISOString(),
      tax_year: new Date().getFullYear(),
      recipient_name: payment.profiles.full_name,
      recipient_email: payment.profiles.email,
      description: payment.description,
    };

    const { data: receipt, error: receiptError } = await supabaseClient
      .from('tax_receipts')
      .insert(receiptData)
      .select()
      .single();

    if (receiptError) throw receiptError;

    return new Response(JSON.stringify({ receipt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Tax receipt generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
