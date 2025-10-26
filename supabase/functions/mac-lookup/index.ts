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
    const { mac } = await req.json();
    
    if (!mac) {
      return new Response(
        JSON.stringify({ error: 'MAC address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean and validate MAC address
    const cleanMac = mac.replace(/[:-]/g, '').toUpperCase();
    
    if (cleanMac.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Invalid MAC address format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OUI (first 6 characters)
    const oui = cleanMac.substring(0, 6);

    // Use macaddress.io API
    const response = await fetch(`https://api.macaddress.io/v1?apiKey=at_free&output=json&search=${oui}`);
    const data = await response.json();

    const result = {
      mac: mac,
      oui: oui,
      vendor: data.vendorDetails?.companyName || 'Unknown',
      company: data.vendorDetails?.companyName || 'Unknown',
      address: data.vendorDetails?.companyAddress || 'N/A',
      country: data.vendorDetails?.countryCode || 'N/A',
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('MAC lookup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});