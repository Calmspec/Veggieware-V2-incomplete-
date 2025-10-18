
import { User } from '../types';

const HELP_TEXT = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    VEGGIEWARE 3.0 - OSINT COMMAND CENTER                     ║
║                    70+ Professional Intelligence Tools                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─ SOCIAL MEDIA INTELLIGENCE ─────────────────────────────────────────────────┐
│ instagram <USER>     - Instagram OSINT (posts, followers, metadata)         │
│ facebook <NAME>      - Facebook profile reconnaissance                      │
│ twitter <USER>       - Twitter/X profile enumeration                        │
│ linkedin <NAME>      - LinkedIn profile intelligence                        │
│ github <USER>        - GitHub profile & repository intelligence             │
│ tiktok <USER>        - TikTok account analysis                              │
│ reddit <USER>        - Reddit user history & analysis                       │
│ snapchat <USER>      - Snapchat user lookup                                 │
│ discord <ID>         - Discord user account analysis                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ NETWORK & DOMAIN ANALYSIS ─────────────────────────────────────────────────┐
│ whois <DOMAIN>       - Domain registration & ownership data                 │
│ nslookup <DOMAIN>    - DNS lookup & records                                 │
│ dig <DOMAIN>         - DNS query (alias for nslookup)                       │
│ traceroute <HOST>    - Network path traceroute                              │
│ subdomain <DOMAIN>   - Subdomain enumeration                                │
│ port-scan <IP>       - Port scanning analysis                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ EMAIL & PHONE OSINT ───────────────────────────────────────────────────────┐
│ email-verify <EMAIL> - Email validation & verification                      │
│ phone <PHONE>        - International phone validation (200+ countries)      │
│ phone-format <NUM>   - Phone number formatting                              │
│ breach <QUERY>       - Universal breach check (email/phone/username)        │
│ username <USER>      - Username search across platforms                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ IP & GEOLOCATION ──────────────────────────────────────────────────────────┐
│ ip-info <IP>         - IP information & geolocation                         │
│ geoip <IP>           - GeoIP lookup                                         │
│ reverse-ip <IP>      - Reverse IP lookup                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ GOOGLE DORKS & SEARCH ─────────────────────────────────────────────────────┐
│ dork <QUERY>         - Generate Google dork queries                         │
│ google-dork <QUERY>  - Google dork search (alias)                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ IMAGE & FILE ANALYSIS ─────────────────────────────────────────────────────┐
│ reverse-image        - Reverse image search tools                           │
│ exif                 - EXIF data extraction guide                           │
│ metadata <TYPE>      - Metadata analysis tools                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ SPECIALIZED TOOLS ─────────────────────────────────────────────────────────┐
│ wayback <URL>        - Wayback Machine archive lookup                       │
│ pastebin <QUERY>     - Pastebin search for leaks                            │
│ shodan <QUERY>       - Shodan IoT device search                             │
│ blockchain <ADDR>    - Blockchain address analysis                          │
│ mac-lookup <MAC>     - MAC address vendor lookup                            │
│ company <NAME>       - Company research tools                               │
│ person <NAME>        - Person research aggregator                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ ENCODING & CRYPTO ─────────────────────────────────────────────────────────┐
│ password-check <PWD> - Password strength analysis                           │
│ hash <TEXT>          - Hash type identification                             │
│ base64 <TEXT>        - Base64 encode/decode                                 │
│ url-decode <URL>     - URL decoding                                         │
│ url-encode <URL>     - URL encoding                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ SYSTEM COMMANDS ───────────────────────────────────────────────────────────┐
│ help                 - Show this command reference                          │
│ clear                - Clear terminal history                               │
│ exit                 - Logout from terminal                                 │
└─────────────────────────────────────────────────────────────────────────────┘

[*] Type any command without arguments for detailed usage instructions
`;

export const executeCommand = async (input: string, user: User): Promise<string> => {
  const [command, ...args] = input.trim().toLowerCase().split(' ');
  
  switch (command) {
    case 'help':
      return HELP_TEXT;
    
    case 'clear':
      return 'CLEAR_SCREEN';
    
    case 'phone':
      if (args.length === 0) return 'Usage: phone <number>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.phoneLookup(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Phone lookup failed. Please try again.';
      }
    
    case 'breach':
      if (args.length === 0) return 'Usage: breach <email|username|phone|ip>';
      try {
        const { api } = await import('../lib/api');
        const query = args[0];
        let queryType = 'email';
        if (query.includes('@')) queryType = 'email';
        else if (/^\d+$/.test(query)) queryType = 'phone';
        else if (/^\d+\.\d+\.\d+\.\d+$/.test(query)) queryType = 'ip';
        else queryType = 'username';
        
        const result = await api.breachLookup(query, queryType);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Breach lookup failed. Please try again.';
      }
    
    case 'discord':
      if (args.length === 0) return 'Usage: discord <user_id>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.discordLookup(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Discord lookup failed. Please try again.';
      }

    // Social Media Commands
    case 'instagram':
      if (args.length === 0) return 'Usage: instagram <username>';
      return `Instagram OSINT for @${args[0]}:\n\n` +
        `• Profile: https://www.instagram.com/${args[0]}/\n` +
        `• Stories: Check via web or app\n` +
        `• Followers: Analyze engagement patterns\n` +
        `• Posts: Look for location tags, timestamps\n` +
        `• Tools: Picuki, ImgInn for viewing without account`;

    case 'facebook':
      if (args.length === 0) return 'Usage: facebook <name or id>';
      return `Facebook OSINT for "${args.join(' ')}":\n\n` +
        `• Search: https://www.facebook.com/search/top?q=${encodeURIComponent(args.join(' '))}\n` +
        `• Graph Search: Use specific queries\n` +
        `• Check: Photos, posts, friends, groups\n` +
        `• Tip: Use advanced search operators`;

    case 'twitter':
    case 'x':
      if (args.length === 0) return 'Usage: twitter <username>';
      return `Twitter/X OSINT for @${args[0]}:\n\n` +
        `• Profile: https://twitter.com/${args[0]}\n` +
        `• Advanced Search: https://twitter.com/search-advanced\n` +
        `• Timeline: Check tweets, replies, likes\n` +
        `• Tools: TweetDeck, Nitter for privacy`;

    case 'linkedin':
      if (args.length === 0) return 'Usage: linkedin <name>';
      return `LinkedIn OSINT for "${args.join(' ')}":\n\n` +
        `• Search: https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(args.join(' '))}\n` +
        `• Check: Work history, connections, skills\n` +
        `• Company: Research employer details\n` +
        `• Boolean: Use AND, OR, NOT operators`;

    case 'github':
      if (args.length === 0) return 'Usage: github <username>';
      return `GitHub OSINT for ${args[0]}:\n\n` +
        `• Profile: https://github.com/${args[0]}\n` +
        `• Repos: Check code, commits, stars\n` +
        `• Activity: Contributions, issues, PRs\n` +
        `• Gists: https://gist.github.com/${args[0]}`;

    case 'tiktok':
      if (args.length === 0) return 'Usage: tiktok <username>';
      return `TikTok OSINT for @${args[0]}:\n\n` +
        `• Profile: https://www.tiktok.com/@${args[0]}\n` +
        `• Videos: Check captions, sounds, hashtags\n` +
        `• Engagement: Likes, comments, shares\n` +
        `• Location: Look for tagged places`;

    case 'reddit':
      if (args.length === 0) return 'Usage: reddit <username>';
      return `Reddit OSINT for u/${args[0]}:\n\n` +
        `• Profile: https://www.reddit.com/user/${args[0]}\n` +
        `• Posts: Check submissions history\n` +
        `• Comments: Analyze interactions\n` +
        `• Tools: RedditMetis, Reddit Search`;

    case 'snapchat':
      if (args.length === 0) return 'Usage: snapchat <username>';
      return `Snapchat OSINT for ${args[0]}:\n\n` +
        `• Add via username or snapcode\n` +
        `• Check: Stories, Snap Map\n` +
        `• Location: If sharing on map\n` +
        `• Note: Limited public info`;

    // Network Commands
    case 'whois':
      if (args.length === 0) return 'Usage: whois <domain>';
      return `WHOIS Lookup for ${args[0]}:\n\n` +
        `• Online Tool: https://who.is/whois/${args[0]}\n` +
        `• Check: Registrar, creation date, expiry\n` +
        `• Contact: Admin, tech contacts (if public)\n` +
        `• Nameservers: DNS information`;

    case 'nslookup':
    case 'dig':
      if (args.length === 0) return 'Usage: nslookup <domain>';
      return `DNS Lookup for ${args[0]}:\n\n` +
        `• A Records: IPv4 addresses\n` +
        `• AAAA: IPv6 addresses\n` +
        `• MX: Mail servers\n` +
        `• TXT: SPF, DKIM records\n` +
        `• Tool: https://mxtoolbox.com/SuperTool.aspx?action=a:${args[0]}`;

    case 'traceroute':
      if (args.length === 0) return 'Usage: traceroute <domain or ip>';
      return `Traceroute to ${args[0]}:\n\n` +
        `• Online Tool: https://www.traceroute-online.com/\n` +
        `• Shows: Network path and hops\n` +
        `• Latency: Response times\n` +
        `• Geography: Hop locations`;

    case 'subdomain':
      if (args.length === 0) return 'Usage: subdomain <domain>';
      return `Subdomain Enumeration for ${args[0]}:\n\n` +
        `• Tools: crt.sh, Sublist3r, Amass\n` +
        `• Certificate Transparency: https://crt.sh/?q=%.${args[0]}\n` +
        `• DNS: Check DNS records\n` +
        `• Brute Force: Common subdomain names`;

    case 'port-scan':
      if (args.length === 0) return 'Usage: port-scan <ip or domain>';
      return `Port Scanning ${args[0]}:\n\n` +
        `⚠️  WARNING: Only scan systems you own/have permission\n` +
        `• Common Ports: 80, 443, 22, 21, 25, 3306\n` +
        `• Tools: Nmap, Shodan\n` +
        `• Services: Identify running services`;

    // Email & Phone
    case 'email-verify':
      if (args.length === 0) return 'Usage: email-verify <email>';
      return `Email Verification for ${args[0]}:\n\n` +
        `• Format: ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args[0]) ? '✓ Valid' : '✗ Invalid'}\n` +
        `• Tools: Hunter.io, EmailHippo\n` +
        `• Check: MX records, SMTP validation\n` +
        `• Breach: Check haveibeenpwned.com`;

    case 'phone-format':
      if (args.length === 0) return 'Usage: phone-format <number>';
      const cleaned = args[0].replace(/\D/g, '');
      return `Phone Number Analysis:\n\n` +
        `• Original: ${args[0]}\n` +
        `• Cleaned: ${cleaned}\n` +
        `• Length: ${cleaned.length} digits\n` +
        `• Format: ${cleaned.length === 10 ? '(XXX) XXX-XXXX' : 'International format may vary'}`;

    case 'username':
      if (args.length === 0) return 'Usage: username <username>';
      return `Username Search for "${args[0]}":\n\n` +
        `• Namechk: https://namechk.com/${args[0]}\n` +
        `• KnowEm: Check 500+ social networks\n` +
        `• Manual: Search each platform individually\n` +
        `• Variations: Try with numbers, underscores`;

    // IP & Location
    case 'ip-info':
      if (args.length === 0) return 'Usage: ip-info <ip>';
      return `IP Information for ${args[0]}:\n\n` +
        `• Lookup: https://ipinfo.io/${args[0]}\n` +
        `• Geolocation: City, region, country\n` +
        `• ISP: Internet service provider\n` +
        `• ASN: Autonomous system number`;

    case 'geoip':
      if (args.length === 0) return 'Usage: geoip <ip>';
      return `GeoIP Lookup for ${args[0]}:\n\n` +
        `• Location: Approximate geographic location\n` +
        `• Tools: MaxMind, IP2Location\n` +
        `• Accuracy: City-level (varies)\n` +
        `• VPN: May show VPN server location`;

    case 'reverse-ip':
      if (args.length === 0) return 'Usage: reverse-ip <ip>';
      return `Reverse IP Lookup for ${args[0]}:\n\n` +
        `• Find: Domains hosted on this IP\n` +
        `• Tools: ViewDNS, YouGetSignal\n` +
        `• Shared Hosting: Multiple domains possible\n` +
        `• URL: https://viewdns.info/reverseip/?host=${args[0]}`;

    // Google Dorks
    case 'dork':
    case 'google-dork':
      if (args.length === 0) {
        return `Google Dork Examples:\n\n` +
          `• site:example.com - Search specific site\n` +
          `• filetype:pdf - Find PDF files\n` +
          `• intitle:"index of" - Directory listings\n` +
          `• inurl:admin - URLs with "admin"\n` +
          `• cache:example.com - Cached version\n` +
          `• related:example.com - Similar sites`;
      }
      return `Google Dork: ${args.join(' ')}\n\n` +
        `Search: https://www.google.com/search?q=${encodeURIComponent(args.join(' '))}\n` +
        `Tip: Combine operators for better results`;

    // Image & File
    case 'reverse-image':
      return `Reverse Image Search:\n\n` +
        `• Google: https://images.google.com\n` +
        `• TinEye: https://tineye.com\n` +
        `• Yandex: Often best for faces\n` +
        `• Bing: https://www.bing.com/images`;

    case 'exif':
      return `EXIF Data Extraction:\n\n` +
        `• What: Metadata in images (camera, GPS, timestamp)\n` +
        `• Tools: ExifTool, Jeffrey's Exif Viewer\n` +
        `• Online: https://exifdata.com\n` +
        `• Privacy: Remove before sharing photos`;

    case 'metadata':
      if (args.length === 0) return 'Usage: metadata <file type>';
      return `Metadata Analysis for ${args[0]}:\n\n` +
        `• Images: EXIF data (camera, GPS, date)\n` +
        `• PDFs: Author, creation date, software\n` +
        `• Documents: Author, revisions, comments\n` +
        `• Tools: ExifTool, FOCA, Metagoofil`;

    // Specialized
    case 'wayback':
      if (args.length === 0) return 'Usage: wayback <url>';
      return `Wayback Machine for ${args[0]}:\n\n` +
        `• Archive: https://web.archive.org/web/*/${args[0]}\n` +
        `• History: View website over time\n` +
        `• Deleted: Recover removed content\n` +
        `• Snapshots: Multiple versions available`;

    case 'pastebin':
      if (args.length === 0) return 'Usage: pastebin <search term>';
      return `Pastebin Search for "${args.join(' ')}":\n\n` +
        `• Search: https://psbdmp.ws\n` +
        `• Leaks: Email, password dumps\n` +
        `• Code: Source code leaks\n` +
        `• Monitor: Set alerts for keywords`;

    case 'shodan':
      if (args.length === 0) return 'Usage: shodan <ip or query>';
      return `Shodan Search for ${args[0]}:\n\n` +
        `• IoT: Internet-connected devices\n` +
        `• Ports: Open ports and services\n` +
        `• Vulnerabilities: Known CVEs\n` +
        `• URL: https://www.shodan.io/search?query=${encodeURIComponent(args[0])}`;

    case 'blockchain':
      if (args.length === 0) return 'Usage: blockchain <address>';
      return `Blockchain Analysis for ${args[0]}:\n\n` +
        `• Bitcoin: blockchain.com/btc/address/${args[0]}\n` +
        `• Ethereum: etherscan.io/address/${args[0]}\n` +
        `• Transactions: Track wallet activity\n` +
        `• Balance: Current holdings`;

    case 'mac-lookup':
      if (args.length === 0) return 'Usage: mac-lookup <mac address>';
      return `MAC Address Lookup for ${args[0]}:\n\n` +
        `• Vendor: Identify manufacturer\n` +
        `• Tool: https://macaddress.io/mac-address-lookup\n` +
        `• Format: XX:XX:XX:XX:XX:XX\n` +
        `• OUI: First 3 bytes = vendor`;

    case 'company':
      if (args.length === 0) return 'Usage: company <company name>';
      return `Company Research for "${args.join(' ')}":\n\n` +
        `• LinkedIn: Company page, employees\n` +
        `• Crunchbase: Funding, acquisitions\n` +
        `• WHOIS: Domain registration\n` +
        `• News: Recent articles and press`;

    case 'person':
      if (args.length === 0) return 'Usage: person <full name>';
      return `Person Research for "${args.join(' ')}":\n\n` +
        `• Google: "${args.join(' ')}"\n` +
        `• Social Media: All major platforms\n` +
        `• Public Records: Varies by location\n` +
        `• Images: Reverse image search`;

    case 'password-check':
      if (args.length === 0) return 'Usage: password-check <password>';
      return `⚠️  WARNING: Never enter your real password!\n\n` +
        `Password Strength Analysis:\n` +
        `• Length: ${args[0].length} characters\n` +
        `• Has Uppercase: ${/[A-Z]/.test(args[0]) ? '✓' : '✗'}\n` +
        `• Has Lowercase: ${/[a-z]/.test(args[0]) ? '✓' : '✗'}\n` +
        `• Has Numbers: ${/\d/.test(args[0]) ? '✓' : '✗'}\n` +
        `• Has Symbols: ${/[^A-Za-z0-9]/.test(args[0]) ? '✓' : '✗'}\n` +
        `• Check Breach: haveibeenpwned.com/Passwords`;

    case 'hash':
      if (args.length === 0) return 'Usage: hash <text>';
      return `Hash Analysis:\n\n` +
        `• MD5: ${args[0].length === 32 ? 'Possible MD5' : 'Not MD5'}\n` +
        `• SHA1: ${args[0].length === 40 ? 'Possible SHA1' : 'Not SHA1'}\n` +
        `• SHA256: ${args[0].length === 64 ? 'Possible SHA256' : 'Not SHA256'}\n` +
        `• Crack: Try CrackStation, HashKiller`;

    case 'base64':
      if (args.length === 0) return 'Usage: base64 <text>';
      try {
        const decoded = atob(args[0]);
        return `Base64 Decode:\n\n• Decoded: ${decoded}`;
      } catch {
        const encoded = btoa(args[0]);
        return `Base64 Encode:\n\n• Encoded: ${encoded}`;
      }

    case 'url-decode':
      if (args.length === 0) return 'Usage: url-decode <encoded url>';
      return `URL Decoded:\n\n${decodeURIComponent(args[0])}`;

    case 'url-encode':
      if (args.length === 0) return 'Usage: url-encode <url>';
      return `URL Encoded:\n\n${encodeURIComponent(args[0])}`;

    default:
      return `Command not found: ${command}\nType 'help' for available commands.`;
  }
};
