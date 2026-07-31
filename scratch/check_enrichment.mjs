import { poets } from "../src/data/poets.js";
import { works } from "../src/data/works.js";

console.log("=== POETS ===");
let enrichedPoets = 0;
for (const p of poets) {
  const isEnriched = p.identity && p.identity.length > 200 && p.historical_context && p.historical_context.length > 200;
  console.log(`- ${p.name} (${p.slug}): ${isEnriched ? "✅ ENRICHED" : "❌ NOT ENRICHED"} (${p.identity ? p.identity.length : 0} chars)`);
  if (isEnriched) enrichedPoets++;
}
console.log(`Total Enriched Poets: ${enrichedPoets} / ${poets.length}`);

console.log("\n=== WORKS ===");
let enrichedWorks = 0;
for (const w of works) {
  const isEnriched = w.overview && w.overview.length > 200 && w.political_context && w.political_context.length > 200;
  console.log(`- ${w.title} (${w.slug}): ${isEnriched ? "✅ ENRICHED" : "❌ NOT ENRICHED"} (${w.overview ? w.overview.length : 0} chars)`);
  if (isEnriched) enrichedWorks++;
}
console.log(`Total Enriched Works: ${enrichedWorks} / ${works.length}`);
