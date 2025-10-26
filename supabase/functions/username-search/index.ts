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
    const { username } = await req.json();
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const platforms = [
      { name: 'GitHub', url: `https://github.com/${username}`, checkUrl: `https://api.github.com/users/${username}` },
      { name: 'Twitter/X', url: `https://twitter.com/${username}`, checkUrl: `https://twitter.com/${username}` },
      { name: 'Instagram', url: `https://instagram.com/${username}`, checkUrl: `https://instagram.com/${username}` },
      { name: 'Reddit', url: `https://reddit.com/user/${username}`, checkUrl: `https://reddit.com/user/${username}/about.json` },
      { name: 'TikTok', url: `https://tiktok.com/@${username}`, checkUrl: `https://tiktok.com/@${username}` },
    ];

    const results = await Promise.all(
      platforms.map(async (platform) => {
        try {
          const response = await fetch(platform.checkUrl, {
            method: 'HEAD',
            redirect: 'follow',
          });
          
          return {
            platform: platform.name,
            url: platform.url,
            exists: response.status === 200,
            status: response.status,
          };
        } catch (e) {
          return {
            platform: platform.name,
            url: platform.url,
            exists: false,
            status: 'error',
          };
        }
      })
    );

    return new Response(
      JSON.stringify({ username, platforms: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Username search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});