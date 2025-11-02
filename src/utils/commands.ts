
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
      try {
        const { api } = await import('../lib/api');
        const result = await api.socialLookup(args[0], 'instagram');
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Instagram lookup failed. Please try again.';
      }

    case 'facebook':
      if (args.length === 0) return 'Usage: facebook <name or id>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.socialLookup(args.join(' '), 'facebook');
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Facebook lookup failed. Please try again.';
      }

    case 'twitter':
    case 'x':
      if (args.length === 0) return 'Usage: twitter <username>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.socialLookup(args[0], 'twitter');
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Twitter lookup failed. Please try again.';
      }

    case 'linkedin':
      if (args.length === 0) return 'Usage: linkedin <name>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.socialLookup(args.join(' '), 'linkedin');
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'LinkedIn lookup failed. Please try again.';
      }

    case 'github':
      if (args.length === 0) return 'Usage: github <username>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.socialLookup(args[0], 'github');
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'GitHub lookup failed. Please try again.';
      }

    case 'tiktok':
      if (args.length === 0) return 'Usage: tiktok <username>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.socialLookup(args[0], 'tiktok');
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'TikTok lookup failed. Please try again.';
      }

    case 'reddit':
      if (args.length === 0) return 'Usage: reddit <username>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.socialLookup(args[0], 'reddit');
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Reddit lookup failed. Please try again.';
      }

    case 'snapchat':
      if (args.length === 0) return 'Usage: snapchat <username>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.socialLookup(args[0], 'snapchat');
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Snapchat lookup failed. Please try again.';
      }

    // Network Commands
    case 'whois':
      if (args.length === 0) return 'Usage: whois <domain>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.whoisLookup(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'WHOIS lookup failed. Please try again.';
      }

    case 'nslookup':
    case 'dig':
      if (args.length === 0) return 'Usage: nslookup <domain>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.dnsLookup(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'DNS lookup failed. Please try again.';
      }

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
      try {
        const { api } = await import('../lib/api');
        const result = await api.emailVerify(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Email verification failed. Please try again.';
      }

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
      try {
        const { api } = await import('../lib/api');
        const result = await api.usernameSearch(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Username search failed. Please try again.';
      }

    // IP & Location
    case 'ip-info':
    case 'geoip':
      if (args.length === 0) return 'Usage: ip-info <ip>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.ipLookup(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'IP lookup failed. Please try again.';
      }

    case 'reverse-ip':
      if (args.length === 0) return 'Usage: reverse-ip <ip>';
      try {
        const { api } = await import('../lib/api');
        const result = await api.ipLookup(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'Reverse IP lookup failed. Please try again.';
      }

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
      try {
        const { api } = await import('../lib/api');
        const result = await api.macLookup(args[0]);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return 'MAC lookup failed. Please try again.';
      }

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
