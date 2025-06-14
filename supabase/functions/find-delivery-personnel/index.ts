
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

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const lat = parseFloat(url.searchParams.get('lat') || '0')
      const lng = parseFloat(url.searchParams.get('lng') || '0')

      // Find available delivery personnel
      const { data, error } = await supabaseClient
        .from('profiles')
        .select(`
          id,
          full_name,
          phone,
          delivery_details!inner(
            vehicle_type,
            license_number,
            is_available,
            current_location_lat,
            current_location_lng,
            verification_status
          )
        `)
        .eq('role', 'delivery')
        .eq('delivery_details.is_available', true)
        .eq('delivery_details.verification_status', 'verified')

      if (error) {
        console.error('Error fetching delivery personnel:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Calculate distances and add mock rating data
      const personnelWithDistance = data?.map(person => {
        const personLat = person.delivery_details[0]?.current_location_lat || 0
        const personLng = person.delivery_details[0]?.current_location_lng || 0
        
        // Simple distance calculation (approximate)
        const distance = Math.sqrt(
          Math.pow(lat - personLat, 2) + Math.pow(lng - personLng, 2)
        ) * 111 // Convert to approximate km

        return {
          id: person.id,
          name: person.full_name,
          phone: person.phone,
          vehicle_type: person.delivery_details[0]?.vehicle_type,
          distance: Math.round(distance * 10) / 10,
          rating: 4.5 + Math.random() * 0.5, // Mock rating
          total_deliveries: Math.floor(Math.random() * 200) + 50, // Mock deliveries
          available: true
        }
      }).sort((a, b) => a.distance - b.distance) || []

      return new Response(
        JSON.stringify({ personnel: personnelWithDistance }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in find-delivery-personnel function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
