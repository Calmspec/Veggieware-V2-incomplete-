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

    // Use Google DNS-over-HTTPS API
    const types = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];
    const records: any = {};

    for (const type of types) {
      try {
        const response = await fetch(
          `https://dns.google/resolve?name=${domain}&type=${type}`
        );
        const data = await response.json();
        
        if (data.Answer) {
          records[type] = data.Answer.map((ans: any) => ({
            name: ans.name,
            type: ans.type,
            data: ans.data,
            ttl: ans.TTL,
          }));
        }
      } catch (e) {
        console.error(`Failed to lookup ${type} records:`, e);
      }
    }

    return new Response(
      JSON.stringify({ domain, records }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('DNS lookup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});