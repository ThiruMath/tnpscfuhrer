// process-notes.mjs
// ─────────────────────────────────────────────────────────────────
// Reads your .env file automatically — no setup needed!
//
// 1. Add this line to your .env file:
//       GEMINI_API_KEY=your_key_here
//
// 2. Run in VS Code terminal:
//       node process-notes.mjs
//
// Options:
//   node process-notes.mjs --limit 5        ← test with 5 notes first
//   node process-notes.mjs --only "Chola"   ← one specific note
//   node process-notes.mjs --reprocess      ← redo all notes
// ─────────────────────────────────────────────────────────────────

import fs   from "fs";
import path from "path";

// ── Step 1: Load .env file automatically ─────────────────────────
try {
  const envFile = fs.readFileSync(".env", "utf8");
  envFile.split("\n").forEach(line => {
    line = line.trim();
    if (!line || line.startsWith("#")) return;   // skip empty & comments
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) return;
    const key = line.slice(0, eqIndex).trim();
    const val = line.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, ""); // strip quotes
    if (key) process.env[key] = val;
  });
} catch {
  // .env not found — will catch below with helpful message
}

// ── Settings ──────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL   = "gemini-2.0-flash";
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const NOTES_DIR  = "src/content/notes";
const BACKUP_DIR = "src/content/notes/_backup";
const CACHE_FILE = "src/content/notes/_cache.json";
const DELAY_MS   = 5000;   // 5s between calls — safe under free tier
const MAX_RETRY  = 3;      // retry up to 3x on rate limit

// ── CLI args ──────────────────────────────────────────────────────
const args      = process.argv.slice(2);
const onlyFile  = argVal("--only");
const limitN    = parseInt(argVal("--limit") || "0");
const reprocess = args.includes("--reprocess");

function argVal(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}

// ── Gemini prompt ─────────────────────────────────────────────────
function buildPrompt(filename, mdText) {
  return `You are an expert educational content writer for TNPSC exam preparation (Tamil Nadu Public Service Commission).

Rewrite the raw study notes below into clear, well-structured Wikipedia-style markdown.

RULES:
1. Rewrite in clean English for competitive exam students.
2. Keep ALL facts, dates, names, numbers, and technical terms exactly correct.
3. Start with a short 2-3 sentence introduction summarising the topic.
4. Use ## for main sections, ### for sub-sections.
5. Convert messy bullet dumps into proper paragraphs OR clean lists — whichever reads better.
6. Use **bold** for key terms, important names, dates, and exam-relevant facts.
7. Format tabular data as markdown tables.
8. End with a ## Quick Facts section with 4-6 exam-important bullet points.

Return ONLY valid JSON — no markdown fences, no explanation, no extra text.
JSON shape:
{
  "title": "Clean readable title for this note",
  "summary": "One sentence summary for search results",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "content": "Full improved markdown content here"
}

Source file: ${filename}
Raw notes:
---
${mdText}
---`;
}

// ── Call Gemini API (with retry on 429) ──────────────────────────
async function callGemini(filename, mdText, attempt = 1) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: buildPrompt(filename, mdText) }] }],
    generationConfig: { temperature: 0.25, maxOutputTokens: 4000 }
  });

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });

  // Rate limit — wait and retry
  if (res.status === 429 && attempt <= MAX_RETRY) {
    const wait = attempt * 15000;   // 15s, 30s, 45s
    process.stdout.write(`\n     rate limited, waiting ${wait/1000}s (retry ${attempt}/${MAX_RETRY})... `);
    await new Promise(r => setTimeout(r, wait));
    return callGemini(filename, mdText, attempt + 1);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip accidental code fences Gemini sometimes adds
  raw = raw.replace(/^```json\s*/m, "").replace(/^```\s*/m, "").replace(/```\s*$/m, "").trim();

  return JSON.parse(raw);
}

// ── Write improved MD back to same file ───────────────────────────
function writeImprovedNote(filePath, parsed, originalFilename) {
  const { title, summary, keywords, content } = parsed;
  const date   = new Date().toISOString().split("T")[0];
  const kwLine = (keywords || []).join(", ");

  const output =
`<!--
title: ${title}
summary: ${summary}
keywords: ${kwLine}
source: ${originalFilename}
processed: ${date}
-->

${content}
`;
  fs.writeFileSync(filePath, output, "utf8");
}

// ── Cache: tracks which files are done ───────────────────────────
function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")); }
  catch { return {}; }
}
function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {

  // Check API key
  if (!GEMINI_API_KEY) {
    console.error(`
❌  GEMINI_API_KEY not found!

Open your .env file and add this line:
    GEMINI_API_KEY=your_key_here

Then run again:
    node process-notes.mjs
`);
    process.exit(1);
  }

  // Create backup folder
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const cache = loadCache();

  // Get all .md files (skip internal _ files like _backup, _cache)
  let allFiles = fs.readdirSync(NOTES_DIR)
    .filter(f => f.endsWith(".md") && !f.startsWith("_"));

  // --only filter
  if (onlyFile) {
    const target = onlyFile.toLowerCase();
    allFiles = allFiles.filter(f =>
      f.toLowerCase().replace(/_/g, " ").replace(".md", "").includes(target)
    );
    if (!allFiles.length) {
      console.error(`❌  No file matching "${onlyFile}" found in ${NOTES_DIR}/`);
      process.exit(1);
    }
  }

  // Skip already-processed files (unless --reprocess)
  const toProcess = reprocess ? allFiles : allFiles.filter(f => !cache[f]);

  // Apply --limit
  const batch = limitN > 0 ? toProcess.slice(0, limitN) : toProcess;

  if (!batch.length) {
    console.log(`\n✅  All ${allFiles.length} notes already processed!`);
    console.log(`   Add new .md files to ${NOTES_DIR}/ and run again.`);
    console.log(`   Use --reprocess to force redo all.\n`);
    return;
  }

  console.log(`\n📚  TNPSC Notes Processor`);
  console.log(`   Folder : ${NOTES_DIR}/`);
  console.log(`   To do  : ${batch.length} of ${allFiles.length} files`);
  console.log(`   Model  : ${GEMINI_MODEL}\n`);

  let done = 0, failed = 0;

  for (const filename of batch) {
    const filePath   = path.join(NOTES_DIR, filename);
    const backupPath = path.join(BACKUP_DIR, filename);

    const mdText = fs.readFileSync(filePath, "utf8");

    // Skip files already improved
    if (!reprocess && mdText.startsWith("<!--\ntitle:")) {
      cache[filename] = true;
      saveCache(cache);
      continue;
    }

    // Always backup original first
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    process.stdout.write(`  ⟳  ${filename.slice(0, 48).padEnd(50)} `);

    try {
      const parsed = await callGemini(filename, mdText);
      writeImprovedNote(filePath, parsed, filename);
      cache[filename] = true;
      saveCache(cache);
      done++;
      console.log(`✓`);
    } catch (e) {
      failed++;
      console.log(`✗  ${e.message}`);
      // Restore original if something went wrong
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
      }
    }

    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅  ${done} improved    ❌  ${failed} failed
  📁  Backups: ${BACKUP_DIR}/
  💡  Run again to continue remaining
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

main();
