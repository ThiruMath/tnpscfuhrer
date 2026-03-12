/**
 * Cloudflare Pages Function: /api/news
 * Fetches educational RSS feeds and returns TNPSC-tagged news items.
 * This is a Cloudflare Pages Function (NOT Astro SSR) - safe & isolated.
 */

const SYLLABUS_TAGS = [
  [/parliament|lok sabha|rajya sabha|president|governor|cabinet|minister|constitution|election|judiciary/i, 'Polity'],
  [/economy|budget|gdp|inflation|rbi|bank|rupee|tax|gst|fiscal|monetary|finance/i, 'Economy'],
  [/science|technology|isro|space|satellite|research|artificial intelligence|ai\b/i, 'Science & Tech'],
  [/climate|environment|pollution|renewable|solar|forest|wildlife|ecology/i, 'Environment'],
  [/exam|neet|tnpsc|upsc|scholarship|education|school|university|college/i, 'Education'],
  [/health|disease|vaccination|hospital|medicine|epidemic|who|nutrition/i, 'Health'],
  [/agriculture|farmer|crop|irrigation|fertilizer|soil|msp/i, 'Agriculture'],
  [/award|prize|nobel|padma|bharat ratna|sport|olympic/i, 'Awards & Sports'],
  [/defence|army|navy|air force|missile|border|security/i, 'Defence'],
  [/tamilnadu|tamil nadu|chennai|tn government|tamil/i, 'Tamil Nadu'],
  [/international|united nations|g20|brics|imf|world bank|foreign/i, 'International'],
  [/history|heritage|culture|archaeological|museum|monument/i, 'History & Culture'],
];

function autoTag(text) {
  const tags = [];
  for (const [re, tag] of SYLLABUS_TAGS) {
    if (re.test(text) && !tags.includes(tag)) tags.push(tag);
    if (tags.length >= 3) break;
  }
  return tags;
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#\d+;/g,' ').replace(/\s+/g,' ').trim();
}

function summarize(text, max = 130) {
  const c = stripHtml(text);
  return c.length > max ? c.slice(0, max).replace(/\s+\S*$/, '') + '…' : c;
}

async function parseFeed(url, source) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'TNPSCFuhrer-NewsBot/1.0' },
      signal: AbortSignal.timeout(5000)
    });
    if (!r.ok) return [];
    const xml = await r.text();
    const items = [];
    const re = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = re.exec(xml)) !== null && items.length < 5) {
      const b = m[1];
      const title = stripHtml(b.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] || '').slice(0, 130);
      const link = stripHtml(b.match(/<link>([\s\S]*?)<\/link>/)?.[1] || b.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1] || '').trim();
      const desc = b.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] || '';
      const pubDate = b.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      if (!title || !link) continue;
      const summary = summarize(desc);
      const tags = autoTag(title + ' ' + summary);
      let date = 'Today';
      try { date = pubDate ? new Date(pubDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'Today'; } catch{}
      items.push({ title, link, summary, tags, date, source });
    }
    return items;
  } catch { return []; }
}

export async function onRequest({ request }) {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const feeds = await Promise.allSettled([
    parseFeed('https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', 'PIB India'),
    parseFeed('https://pib.gov.in/RssMain.aspx?ModId=7&Lang=1&Regid=3', 'PIB Eco'),
    parseFeed('https://feeds.feedburner.com/ndtvnews-india-news', 'NDTV'),
    parseFeed('https://timesofindia.indiatimes.com/rssfeeds/1898055.cms', 'Times of India'),
  ]);

  const all = [];
  for (const r of feeds) {
    if (r.status === 'fulfilled') all.push(...r.value);
  }

  // Deduplicate by title prefix
  const seen = new Set();
  const news = all.filter(item => {
    const k = item.title.slice(0, 40).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 8);

  return new Response(JSON.stringify({ news, updatedAt: new Date().toISOString() }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    }
  });
}
