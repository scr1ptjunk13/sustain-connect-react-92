
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { action, period } = await req.json();

    if (action === 'summary') {
      const periodDays = {
        day: 1,
        week: 7,
        month: 30,
        year: 365
      }[period] || 30;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);

      // Get payment summary
      const { data: payments, error } = await supabaseClient
        .from('payments')
        .select('amount, type, status')
        .eq('status', 'completed')
        .gte('completed_at', startDate.toISOString());

      if (error) throw error;

      const summary = payments.reduce((acc, payment) => {
        acc.total_revenue += payment.amount;
        acc.payment_count += 1;
        
        // Calculate fees (assume 3% processing fee)
        const fee = Math.round(payment.amount * 0.03);
        acc.total_fees += fee;
        
        return acc;
      }, {
        total_revenue: 0,
        total_fees: 0,
        payment_count: 0,
        period: period
      });

      summary.net_revenue = summary.total_revenue - summary.total_fees;

      return new Response(JSON.stringify({ summary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });

  } catch (error: any) {
    console.error("Financial reports error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
