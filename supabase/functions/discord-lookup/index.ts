import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    console.log(`Discord lookup for user ID: ${userId}`)

    // Validate Discord user ID format (should be numeric string)
    if (!/^\d{17,19}$/.test(userId)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Discord user ID format',
          details: 'Discord user IDs should be 17-19 digit numbers'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Use Discord API to fetch user information
    // Note: This uses the public Discord API without requiring a bot token
    // We can get basic info from the user snowflake ID
    
    // Calculate account creation date from Discord snowflake
    const discordEpoch = 1420070400000
    const timestamp = BigInt(userId) >> 22n
    const createdAt = new Date(Number(timestamp) + discordEpoch)

    // Format the response with available data
    const userData = {
      userId,
      createdAt: createdAt.toISOString(),
      createdDate: createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      accountAge: Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
      timestamp: new Date().toISOString()
    }

    console.log('Discord lookup successful:', userData)

    return new Response(
      JSON.stringify(userData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Discord lookup error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to lookup Discord user',
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
