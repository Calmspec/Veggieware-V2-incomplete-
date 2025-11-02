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
    const { username, platform } = await req.json();
    
    if (!username || !platform) {
      return new Response(
        JSON.stringify({ error: 'Username and platform are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const osintCatKey = Deno.env.get('OSINTCAT_API_KEY');
    const osintDogKey = Deno.env.get('OSINTDOG_API_KEY');
    
    let result: any = { username, platform };

    // Platform-specific lookups
    switch (platform.toLowerCase()) {
      case 'instagram':
        if (osintCatKey) {
          try {
            const response = await fetch(`https://api.osintcat.com/instagram/${username}`, {
              headers: { 'Authorization': `Bearer ${osintCatKey}` }
            });
            const data = await response.json();
            result = {
              ...result,
              found: !!data.user_id,
              userId: data.user_id,
              fullName: data.full_name,
              biography: data.biography,
              followers: data.follower_count,
              following: data.following_count,
              posts: data.media_count,
              isPrivate: data.is_private,
              isVerified: data.is_verified,
              profilePicUrl: data.profile_pic_url,
              externalUrl: data.external_url,
            };
          } catch (e) {
            console.log('OSINTCAT Instagram lookup failed:', e);
            result.error = 'API lookup failed';
          }
        }
        break;

      case 'twitter':
      case 'x':
        if (osintCatKey) {
          try {
            const response = await fetch(`https://api.osintcat.com/twitter/${username}`, {
              headers: { 'Authorization': `Bearer ${osintCatKey}` }
            });
            const data = await response.json();
            result = {
              ...result,
              found: !!data.id,
              userId: data.id,
              name: data.name,
              screenName: data.screen_name,
              description: data.description,
              followers: data.followers_count,
              following: data.friends_count,
              tweets: data.statuses_count,
              isVerified: data.verified,
              location: data.location,
              createdAt: data.created_at,
              profileImageUrl: data.profile_image_url,
            };
          } catch (e) {
            console.log('OSINTCAT Twitter lookup failed:', e);
            result.error = 'API lookup failed';
          }
        }
        break;

      case 'tiktok':
        if (osintDogKey) {
          try {
            const response = await fetch(`https://api.osintdog.com/tiktok/user/${username}`, {
              headers: { 'X-API-KEY': osintDogKey }
            });
            const data = await response.json();
            result = {
              ...result,
              found: !!data.user,
              userId: data.user?.id,
              nickname: data.user?.nickname,
              signature: data.user?.signature,
              followers: data.stats?.followerCount,
              following: data.stats?.followingCount,
              likes: data.stats?.heartCount,
              videos: data.stats?.videoCount,
              isVerified: data.user?.verified,
              profileUrl: data.user?.avatarLarger,
            };
          } catch (e) {
            console.log('OSINTDOG TikTok lookup failed:', e);
            result.error = 'API lookup failed';
          }
        }
        break;

      case 'github':
        // GitHub has a public API
        try {
          const response = await fetch(`https://api.github.com/users/${username}`);
          if (response.ok) {
            const data = await response.json();
            result = {
              ...result,
              found: true,
              userId: data.id,
              name: data.name,
              bio: data.bio,
              company: data.company,
              location: data.location,
              email: data.email,
              blog: data.blog,
              publicRepos: data.public_repos,
              publicGists: data.public_gists,
              followers: data.followers,
              following: data.following,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              avatarUrl: data.avatar_url,
            };
          } else {
            result.found = false;
            result.message = 'User not found';
          }
        } catch (e) {
          console.log('GitHub lookup failed:', e);
          result.error = 'API lookup failed';
        }
        break;

      case 'reddit':
        try {
          const response = await fetch(`https://www.reddit.com/user/${username}/about.json`);
          if (response.ok) {
            const data = await response.json();
            const user = data.data;
            result = {
              ...result,
              found: true,
              userId: user.id,
              name: user.name,
              linkKarma: user.link_karma,
              commentKarma: user.comment_karma,
              totalKarma: user.total_karma,
              isGold: user.is_gold,
              isMod: user.is_mod,
              hasVerifiedEmail: user.has_verified_email,
              createdAt: new Date(user.created * 1000).toISOString(),
              iconImg: user.icon_img,
            };
          } else {
            result.found = false;
            result.message = 'User not found';
          }
        } catch (e) {
          console.log('Reddit lookup failed:', e);
          result.error = 'API lookup failed';
        }
        break;

      default:
        // Generic username check
        const checkUrl = `https://${platform}.com/${username}`;
        try {
          const response = await fetch(checkUrl, { method: 'HEAD' });
          result.found = response.ok;
          result.url = checkUrl;
          result.message = response.ok ? 'Profile exists' : 'Profile not found';
        } catch (e) {
          result.error = 'Platform not supported or lookup failed';
        }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Social lookup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
