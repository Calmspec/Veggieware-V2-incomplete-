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
    const { query, queryType } = await req.json()
    const intelxApiKey = Deno.env.get('INTELX_API_KEY')

    if (!intelxApiKey) {
      console.error('INTELX_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Intelligence X API not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log(`Breach lookup for ${queryType}: ${query}`)

    // Intelligence X API search endpoint
    const searchResponse = await fetch('https://2.intelx.io/intelligent/search', {
      method: 'POST',
      headers: {
        'x-key': intelxApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        term: query,
        maxresults: 100,
        media: 0,
        sort: 4, // Sort by date
        terminate: []
      })
    })

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()
      console.error('Intelligence X search error:', errorText)
      return new Response(
        JSON.stringify({ 
          error: 'Search failed',
          details: errorText,
          breaches: [],
          total: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const searchData = await searchResponse.json()
    const searchId = searchData.id

    // Wait a moment for results to populate
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Get results
    const resultsResponse = await fetch('https://2.intelx.io/intelligent/search/result', {
      method: 'GET',
      headers: {
        'x-key': intelxApiKey,
      },
    })

    let results = []
    let total = 0

    if (resultsResponse.ok) {
      const resultsData = await resultsResponse.json()
      results = resultsData.records || []
      total = resultsData.total || 0
    }

    // Format breach data
    const breaches = results.map((record: any) => ({
      name: record.name || 'Unknown Source',
      date: record.date || 'Unknown',
      size: record.size || 0,
      type: record.mediah || 'Unknown',
      bucket: record.bucket || 'Unknown'
    }))

    console.log(`Found ${total} results for ${query}`)

    return new Response(
      JSON.stringify({
        query,
        queryType,
        breaches,
        total,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Breach lookup error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to perform breach lookup',
        details: error.message,
        breaches: [],
        total: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
