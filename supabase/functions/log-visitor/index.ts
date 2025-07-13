import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get visitor IP from various possible headers
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIP = req.headers.get('x-real-ip')
    const cfConnecting = req.headers.get('cf-connecting-ip')
    
    let visitorIP = forwardedFor?.split(',')[0] || realIP || cfConnecting || 'Unknown'
    
    // If still unknown, try to get from request
    if (visitorIP === 'Unknown') {
      const url = new URL(req.url)
      visitorIP = url.searchParams.get('ip') || 'Unknown'
    }

    const { username, userAgent, action = 'visit' } = await req.json()

    // Get geolocation data for the IP
    let location = 'Unknown Location'
    try {
      if (visitorIP !== 'Unknown' && visitorIP !== '127.0.0.1' && !visitorIP.startsWith('192.168.')) {
        const geoResponse = await fetch(`http://ip-api.com/json/${visitorIP}`)
        const geoData = await geoResponse.json()
        if (geoData.status === 'success') {
          location = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`
        }
      }
    } catch (error) {
      console.log('Geolocation failed:', error)
    }

    // Insert visitor log
    const { data, error } = await supabaseClient
      .from('visitor_logs')
      .insert({
        ip_address: visitorIP,
        username: username || 'Guest',
        user_agent: userAgent || 'Unknown',
        location: location,
        action: action,
        timestamp: new Date().toISOString()
      })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to log visitor', details: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        ip: visitorIP, 
        location,
        message: 'Visitor logged successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})