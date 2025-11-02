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
    const { domain } = await req.json();
    
    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use whoisjsonapi.com for WHOIS data
    const response = await fetch(`https://www.whoisjsonapi.com/v1/${domain}`);
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          domain: domain,
          error: 'WHOIS lookup failed',
          message: 'Unable to retrieve WHOIS data for this domain'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    if (data.error) {
      return new Response(
        JSON.stringify({ 
          domain: domain,
          error: 'WHOIS lookup failed',
          message: data.error
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = {
      domain: data.domain || domain,
      registrar: data.registrar || 'N/A',
      createdDate: data.created_date || data.creation_date || 'N/A',
      expiryDate: data.expiry_date || data.expiration_date || 'N/A',
      updatedDate: data.updated_date || 'N/A',
      nameservers: data.nameservers || data.name_servers || [],
      status: data.status || [],
      registrantOrg: data.registrant_org || 'REDACTED',
      registrantCountry: data.registrant_country || 'N/A'
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('WHOIS lookup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});