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
    const { phone } = await req.json()
    
    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Clean phone number (remove spaces, dashes, parentheses)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    
    // Basic phone validation
    if (!/^\+?[\d]{7,15}$/.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid phone number format',
          details: 'Phone number must be 7-15 digits, optionally starting with +'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Parse country code and determine region
    let countryCode = ''
    let region = 'Unknown'
    let carrier = 'Unknown'
    
    if (cleanPhone.startsWith('+1') || (cleanPhone.length === 10 && !cleanPhone.startsWith('+'))) {
      countryCode = '+1'
      region = 'United States/Canada'
      carrier = 'North American Carrier'
    } else if (cleanPhone.startsWith('+44')) {
      countryCode = '+44'
      region = 'United Kingdom'
      carrier = 'UK Carrier'
    } else if (cleanPhone.startsWith('+49')) {
      countryCode = '+49'
      region = 'Germany'
      carrier = 'German Carrier'
    } else if (cleanPhone.startsWith('+33')) {
      countryCode = '+33'
      region = 'France'
      carrier = 'French Carrier'
    } else if (cleanPhone.startsWith('+81')) {
      countryCode = '+81'
      region = 'Japan'
      carrier = 'Japanese Carrier'
    } else if (cleanPhone.startsWith('+86')) {
      countryCode = '+86'
      region = 'China'
      carrier = 'Chinese Carrier'
    } else if (cleanPhone.startsWith('+91')) {
      countryCode = '+91'
      region = 'India'
      carrier = 'Indian Carrier'
    } else if (cleanPhone.startsWith('+93')) {
      countryCode = '+93'
      region = 'Afghanistan'
      carrier = 'Afghan Carrier'
    } else if (cleanPhone.startsWith('+61')) {
      countryCode = '+61'
      region = 'Australia'
      carrier = 'Australian Carrier'
    } else if (cleanPhone.startsWith('+55')) {
      countryCode = '+55'
      region = 'Brazil'
      carrier = 'Brazilian Carrier'
    } else {
      // Extract first 1-4 digits as potential country code
      const potentialCode = cleanPhone.slice(0, 4)
      countryCode = '+' + potentialCode
      region = 'International'
      carrier = 'International Carrier'
    }

    const result = {
      phone: cleanPhone,
      countryCode,
      region,
      carrier,
      type: cleanPhone.length <= 10 ? 'Landline/Mobile' : 'Mobile',
      valid: true,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})