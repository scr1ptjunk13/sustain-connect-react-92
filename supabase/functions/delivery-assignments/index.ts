
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
      // Create delivery assignment
      const body = await req.json()
      
      // Verify user is NGO
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'ngo') {
        return new Response(
          JSON.stringify({ error: 'Only NGOs can assign deliveries' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const assignmentData = {
        donation_id: body.donationId,
        delivery_person_id: body.deliveryPersonId,
        ngo_id: user.id,
        delivery_address: body.deliveryAddress,
        delivery_lat: body.deliveryLat,
        delivery_lng: body.deliveryLng,
        pickup_scheduled_at: body.pickupScheduledAt,
        delivery_scheduled_at: body.deliveryScheduledAt,
        notes: body.notes
      }

      const { data, error } = await supabaseClient
        .from('delivery_assignments')
        .insert(assignmentData)
        .select()
        .single()

      if (error) {
        console.error('Error creating delivery assignment:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update donation status to picked_up
      await supabaseClient
        .from('donations')
        .update({ status: 'picked_up' })
        .eq('id', body.donationId)

      return new Response(
        JSON.stringify({ assignment: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'PUT') {
      // Update delivery assignment status
      const url = new URL(req.url)
      const assignmentId = url.pathname.split('/').pop()
      const body = await req.json()

      const { data, error } = await supabaseClient
        .from('delivery_assignments')
        .update({
          status: body.status,
          pickup_completed_at: body.status === 'in_progress' ? new Date().toISOString() : null,
          delivery_completed_at: body.status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', assignmentId)
        .select()
        .single()

      if (error) {
        console.error('Error updating delivery assignment:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update donation status based on delivery status
      let donationStatus = 'picked_up'
      if (body.status === 'in_progress') donationStatus = 'in_transit'
      if (body.status === 'completed') donationStatus = 'delivered'

      await supabaseClient
        .from('donations')
        .update({ status: donationStatus })
        .eq('id', data.donation_id)

      return new Response(
        JSON.stringify({ assignment: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      // Get delivery assignments based on user role
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      let query = supabaseClient.from('delivery_assignments').select(`
        *,
        donation:donations(*),
        delivery_person:profiles!delivery_assignments_delivery_person_id_fkey(full_name, phone),
        ngo:profiles!delivery_assignments_ngo_id_fkey(full_name)
      `)

      if (profile?.role === 'delivery') {
        query = query.eq('delivery_person_id', user.id)
      } else if (profile?.role === 'ngo') {
        query = query.eq('ngo_id', user.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching delivery assignments:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ assignments: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in delivery assignments function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
