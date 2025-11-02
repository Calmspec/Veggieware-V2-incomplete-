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

    const seonApiKey = Deno.env.get('SEON_API_KEY');
    const hackCheckApiKey = Deno.env.get('HACKCHECK_API_KEY');

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
    let mxRecords = [];
    try {
      const dnsResponse = await fetch(
        `https://dns.google/resolve?name=${domain}&type=MX`
      );
      const dnsData = await dnsResponse.json();
      hasMX = dnsData.Answer && dnsData.Answer.length > 0;
      if (dnsData.Answer) {
        mxRecords = dnsData.Answer.map((ans: any) => ans.data);
      }
    } catch (e) {
      console.error('MX lookup failed:', e);
    }

    // Enhanced validation with SEON if available
    let deliverable = null;
    let breachDetected = false;
    let disposable = false;
    let freeProvider = false;

    if (seonApiKey) {
      try {
        const seonResponse = await fetch(
          `https://api.seon.io/SeonRestService/email-api/v2.0/${encodeURIComponent(email)}`,
          { headers: { 'X-API-KEY': seonApiKey } }
        );
        const seonData = await seonResponse.json();
        deliverable = seonData.data?.deliverable;
        breachDetected = seonData.data?.breach === true;
        disposable = seonData.data?.disposable === true;
        freeProvider = seonData.data?.free === true;
      } catch (e) {
        console.log('SEON email check failed:', e);
      }
    }

    const result = {
      email,
      valid: isValidFormat && hasMX,
      formatValid: isValidFormat,
      domain,
      hasMX,
      mxRecords,
      deliverable,
      breachDetected,
      disposable,
      freeProvider,
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