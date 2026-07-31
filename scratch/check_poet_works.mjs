import { poets } from "../src/data/poets.js";

for (const p of poets) {
  if (p.works) {
    for (const w of p.works) {
      if (typeof w !== "string") {
        console.log(`Poet ${p.slug} has a non-string work:`, w, typeof w);
      }
    }
  }
}
console.log("Check complete.");
