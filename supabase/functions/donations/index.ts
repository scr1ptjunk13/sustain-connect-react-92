
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      // Create donation
      const body = await req.json()
      
      const donationData = {
        donor_id: user.id,
        title: body.title,
        description: body.description,
        category: body.category,
        quantity: body.quantity,
        expiry_date: body.expiryDate,
        pickup_address: body.pickupAddress,
        pickup_city: body.pickupCity,
        pickup_state: body.pickupState,
        pickup_zip_code: body.pickupZipCode,
        pickup_lat: body.pickupLat,
        pickup_lng: body.pickupLng,
        pickup_date: body.pickupDate,
        pickup_time_start: body.pickupTimeStart,
        pickup_time_end: body.pickupTimeEnd,
        contact_name: body.contactName,
        contact_phone: body.contactPhone,
        pickup_instructions: body.pickupInstructions,
        special_instructions: body.specialInstructions,
        images: body.images || []
      }

      const { data, error } = await supabaseClient
        .from('donations')
        .insert(donationData)
        .select()
        .single()

      if (error) {
        console.error('Error creating donation:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ donation: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      // Get donations based on user role
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      let query = supabaseClient.from('donations').select(`
        *,
        donor:profiles!donations_donor_id_fkey(full_name, phone),
        claimed_by_profile:profiles!donations_claimed_by_fkey(full_name)
      `)

      if (profile?.role === 'donor') {
        query = query.eq('donor_id', user.id)
      } else if (profile?.role === 'ngo') {
        query = query.in('status', ['pending', 'claimed'])
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching donations:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ donations: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'PUT') {
      // Update donation (for claiming)
      const url = new URL(req.url)
      const donationId = url.pathname.split('/').pop()
      const body = await req.json()

      if (body.action === 'claim') {
        // Verify user is NGO
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'ngo') {
          return new Response(
            JSON.stringify({ error: 'Only NGOs can claim donations' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data, error } = await supabaseClient
          .from('donations')
          .update({
            claimed_by: user.id,
            claimed_at: new Date().toISOString(),
            status: 'claimed'
          })
          .eq('id', donationId)
          .eq('status', 'pending')
          .select()
          .single()

        if (error) {
          console.error('Error claiming donation:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ donation: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in donations function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
