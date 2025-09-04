export function GET() {
  const robotsText = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /static/

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

Sitemap: https://subtally.com/sitemap.xml
Host: https://subtally.com`

  return new Response(robotsText, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}