import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(email);

    if (!isValidFormat) {
      return new Response(
        JSON.stringify({ 
          email,
          valid: false,
          formatValid: false,
          message: 'Invalid email format'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract domain
    const domain = email.split('@')[1];

    // Check MX records using DNS lookup
    let hasMX = false;
    try {
      const dnsResponse = await fetch(
        `https://dns.google/resolve?name=${domain}&type=MX`
      );
      const dnsData = await dnsResponse.json();
      hasMX = dnsData.Answer && dnsData.Answer.length > 0;
    } catch (e) {
      console.error('MX lookup failed:', e);
    }

    const result = {
      email,
      valid: isValidFormat && hasMX,
      formatValid: isValidFormat,
      domain,
      hasMX,
      message: hasMX ? 'Email appears valid' : 'No MX records found for domain'
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});