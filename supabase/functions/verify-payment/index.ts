
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    const { session_id } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === "paid") {
      // Update payment record
      const { data: payment } = await supabaseClient
        .from("payments")
        .update({
          status: "completed",
          stripe_payment_intent_id: session.payment_intent,
          completed_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session_id)
        .select()
        .single();

      if (payment) {
        // Generate tax receipt for donations
        if (payment.type === 'donation_fee') {
          const receiptData = {
            payment_id: payment.id,
            user_id: payment.user_id,
            amount: payment.amount,
            currency: payment.currency,
            receipt_number: `TR-${Date.now()}`,
            issued_date: new Date().toISOString(),
            tax_year: new Date().getFullYear(),
          };

          await supabaseClient.from("tax_receipts").insert(receiptData);
        }

        // Update financial analytics
        await supabaseClient.from("financial_analytics").upsert({
          date: new Date().toISOString().split('T')[0],
          total_revenue: payment.amount,
          payment_count: 1,
          payment_type: payment.type,
        }, {
          onConflict: 'date,payment_type',
          ignoreDuplicates: false,
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        payment: payment 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      message: "Payment not completed" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });

  } catch (error: any) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
