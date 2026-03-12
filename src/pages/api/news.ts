export const prerender = false;

import type { APIRoute } from 'astro';

// TNPSC Syllabus tag rules: keyword → tag
const SYLLABUS_TAGS: [string, string][] = [
  ['pib|press information|government|minister|cabinet|parliament|lok sabha|rajya sabha|president|governor','Polity'],
  ['science|technology|isro|nasa|space|satellite|rocket|research|ai|artificial intelligence','Science & Tech'],
  ['economy|budget|gdp|inflation|rbi|bank|finance|rupee|tax|gst|fiscal|monetary','Economy'],
  ['history|heritage|culture|museum|archaeological|excavation','History & Culture'],
  ['climate|environment|pollution|renewable|solar|forest|wildlife|ecology|biodiversity','Environment'],
  ['education|school|college|university|exam|neet|tnpsc|upsc|scholarship','Education'],
  ['health|disease|vaccination|hospital|medicine|who|epidemic|nutrition','Health'],
  ['agriculture|farmer|crop|irrigation|fertilizer|soil|msp','Agriculture'],
  ['award|prize|nobel|padma|bharat ratna|sport|olympic','Awards & Sports'],
  ['defence|army|navy|air force|missile|border|security|police','Defence'],
  ['tamilnadu|tamil nadu|chennai|madurai|coimbatore|tn government','Tamil Nadu'],
  ['international|un|world|global|g20|brics|foreign','International'],
];

function autoTag(text: string): string[] {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  for (const [pattern, tag] of SYLLABUS_TAGS) {
    if (new RegExp(pattern).test(lower) && !tags.includes(tag)) tags.push(tag);
  }
  return tags.slice(0, 3);
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function summarize(text: string, max = 120) {
  const clean = stripHtml(text);
  return clean.length > max ? clean.slice(0, max).replace(/\s+\S*$/, '') + '…' : clean;
}

async function fetchFeed(url: string, source: string) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TNPSCFuhrer/1.0' }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    const xml = await res.text();
    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const title = stripHtml(block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || '').slice(0, 120);
      const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1] || '').trim();
      const desc = block.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1] || '';
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      if (!title || !link) continue;
      const summary = summarize(desc);
      const tags = autoTag(title + ' ' + summary);
      const date = pubDate ? new Date(pubDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'Today';
      items.push({ title, link, summary, tags, date, source });
      if (items.length >= 6) break;
    }
    return items;
  } catch {
    return [];
  }
}

export const GET: APIRoute = async () => {
  // Educational / govt RSS feeds relevant to TNPSC
  const feeds = await Promise.allSettled([
    fetchFeed('https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', 'PIB India'),
    fetchFeed('https://pib.gov.in/RssMain.aspx?ModId=7&Lang=1&Regid=3', 'PIB Economy'),
    fetchFeed('https://www.thehindu.com/sci-tech/?service=rss', 'The Hindu'),
    fetchFeed('https://timesofindia.indiatimes.com/rssfeeds/1898055.cms', 'Times of India'),
  ]);

  const all: any[] = [];
  for (const result of feeds) {
    if (result.status === 'fulfilled') all.push(...result.value);
  }

  // Deduplicate by title
  const seen = new Set<string>();
  const deduped = all.filter(item => {
    const key = item.title.slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return new Response(JSON.stringify({
    news: deduped.slice(0, 8),
    updatedAt: new Date().toISOString(),
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
    },
  });
};
