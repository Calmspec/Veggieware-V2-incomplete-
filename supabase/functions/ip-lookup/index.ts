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
    const { ip } = await req.json();
    
    if (!ip) {
      return new Response(
        JSON.stringify({ error: 'IP address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use multiple IP intelligence APIs for comprehensive data
    const seonApiKey = Deno.env.get('SEON_API_KEY');
    
    // Primary lookup with ipapi.co
    const ipapiResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const ipapiData = await ipapiResponse.json();

    if (ipapiData.error) {
      return new Response(
        JSON.stringify({ error: ipapiData.reason || 'IP lookup failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enhanced lookup with SEON if available
    let fraudScore = null;
    let vpnDetected = false;
    let proxyDetected = false;
    
    if (seonApiKey) {
      try {
        const seonResponse = await fetch(`https://api.seon.io/SeonRestService/ip-api/v1.0/${ip}`, {
          headers: { 'X-API-KEY': seonApiKey }
        });
        const seonData = await seonResponse.json();
        fraudScore = seonData.data?.fraud_score;
        vpnDetected = seonData.data?.vpn === true;
        proxyDetected = seonData.data?.proxy === true;
      } catch (e) {
        console.log('SEON lookup failed:', e);
      }
    }

    const result = {
      ip: ipapiData.ip,
      city: ipapiData.city,
      region: ipapiData.region,
      country: ipapiData.country_name,
      countryCode: ipapiData.country_code,
      latitude: ipapiData.latitude,
      longitude: ipapiData.longitude,
      timezone: ipapiData.timezone,
      isp: ipapiData.org,
      asn: ipapiData.asn,
      postal: ipapiData.postal,
      fraudScore,
      vpnDetected,
      proxyDetected
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('IP lookup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});