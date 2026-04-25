// parse_ocr.mjs
// Parses the OCR output text from TNPSC PDFs into structured quiz JSON
// Usage: node parse_ocr.mjs <ocr_txt_file> <year> <paper_code>
// Example: node parse_ocr.mjs "11_2025_GRP2A_PAPERII_GS/11_2025_GRP2A_PAPERII_GS_ocr.txt" 2026 GRP2A

import fs from "fs";
import path from "path";

const [, , txtFile, year = "2026", paperCode = "GRP2A"] = process.argv;

if (!txtFile || !fs.existsSync(txtFile)) {
  console.error("Usage: node parse_ocr.mjs <ocr_txt_file> [year] [paper_code]");
  process.exit(1);
}

const rawText = fs.readFileSync(txtFile, "utf-8");

// Split into pages
const pages = rawText.split(/={3,}\s*PAGE \d+\s*={3,}/);

// Merge all pages into one big string, strip Tamil text blocks
// We detect English sections by finding numbered questions
const fullText = pages.join("\n");

// Topic classifier based on keyword matching
function classifyTopic(questionText) {
  const q = questionText.toLowerCase();
  if (/kural|thirukkural|valluvar|sangam|tamil|chera|chola|pandiya|periyar|anna|kamarajar|dravidian|bhakthi/.test(q)) return "Tamil Literature";
  if (/history|munroe|british|mughal|colonial|battle|rebellion|uprising|congress|independence|gandhi|nehru|tilak|revolution|ashoka|maurya|gupta/.test(q)) return "History";
  if (/constitution|article|parliament|supreme court|preamble|fundamental|president|governor|lok sabha|rajya|election commission|directive/.test(q)) return "Polity";
  if (/gdp|inflation|budget|rbi|bank|economy|gst|fiscal|monetary|poverty|agricultural|industry|trade|export|import/.test(q)) return "Economy";
  if (/river|mountain|latitude|longitude|climate|soil|forest|district|state|capital|dam|reservoir|geography|india map|western ghats|eastern ghats/.test(q)) return "Geography";
  if (/physics|chemistry|biology|cell|atom|element|compound|reaction|force|energy|light|sound|magnet|vitamin|disease|bacteria|virus|ecosystem|photosynthesis/.test(q)) return "Science";
  if (/environment|pollution|climate change|biodiversity|wildlife|conservation|ozone|forest|carbon|ecosystem|sustainable/.test(q)) return "Environment";
  if (/current|2024|2025|2026|recent|new|launched|announced|scheme|mission|award|summit/.test(q)) return "Current Affairs";
  if (/series|pattern|analogy|number|sequence|reasoning|logical|odd one|code/.test(q)) return "Reasoning";
  if (/aptitude|percentage|ratio|profit|loss|time|speed|work|average|probability|arithmetic/.test(q)) return "Aptitude";
  if (/grammar|vocabulary|comprehension|fill in|synonym|antonym|spelling|english/.test(q)) return "English";
  return "General Studies";
}

// Determine part A (Q1-100) or part B (Q101-200)
function determinePart(qId) {
  const id = parseInt(qId);
  return id <= 100 ? "A" : "B";
}

const questions = [];

// Regex to find English question blocks
// Pattern: "number. Question text (A) opt (B) opt (C) opt (D) opt"
const questionPattern = /(\d{1,3})\.\s+((?:(?!\n\d{1,3}\.|\nPage|\n={3}).)+)/gis;

// Simpler approach: find all Q blocks by scanning for digit+period patterns
// Split the text by question numbers
const lines = fullText.split(/\r?\n/);

let currentQuestion = null;
let currentOptions = [];
let currentId = null;
let collectingOptions = false;
let isDisputed = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Skip empty, page markers, Tamil text (detect by Tamil Unicode range)
  if (!line || /={3,}/.test(line) || /PAGE \d+/.test(line)) continue;
  
  // Skip lines containing Tamil characters predominantly
  const tamilCharCount = (line.match(/[\u0B80-\u0BFF]/g) || []).length;
  const totalChars = line.replace(/\s/g, '').length;
  if (tamilCharCount > 3 && tamilCharCount / Math.max(totalChars, 1) > 0.3) continue;
  
  // Detect question start: "1.", "12.", "123." at line start
  const qMatch = line.match(/^(\d{1,3})\.\s+(.+)/);
  if (qMatch) {
    // Save previous question
    if (currentQuestion && currentOptions.length >= 2) {
      questions.push({
        id: parseInt(currentId),
        part: determinePart(currentId),
        lang: "en",
        question: currentQuestion.trim(),
        options: currentOptions.slice(0, 4),
        answer: -1, // Will be set separately; no checkmarks in OCR plain text
        topic: classifyTopic(currentQuestion),
        year: parseInt(year),
        paper_code: paperCode,
        disputed: isDisputed,
      });
    }
    
    currentId = qMatch[1];
    currentQuestion = qMatch[2];
    currentOptions = [];
    collectingOptions = false;
    isDisputed = false;
    continue;
  }
  
  // Detect disputed questions
  if (/EXPERT COMMITTEE/i.test(line)) {
    isDisputed = true;
    continue;
  }
  
  // Detect options: lines starting with (A), (B), (C), (D)
  const optMatch = line.match(/^\((A|B|C|D)\)\s+(.+)/i);
  if (optMatch && currentId) {
    collectingOptions = true;
    const optText = optMatch[2].trim();
    if (!/answer not known/i.test(optText)) {
      currentOptions.push(optText);
    }
    continue;
  }
  
  // Detect answer (checkmark lines — rare in OCR but try)
  // √(A) or ✓(A)
  const answerMatch = line.match(/[✓√]\s*\((A|B|C|D)\)/i);
  if (answerMatch && currentId) {
    const answerMap = { A: 0, B: 1, C: 2, D: 3 };
    if (questions.length > 0 && questions[questions.length - 1].id === parseInt(currentId)) {
      questions[questions.length - 1].answer = answerMap[answerMatch[1].toUpperCase()];
    }
    continue;
  }
  
  // Continue building the question text (multi-line questions)
  if (currentId && !collectingOptions) {
    // Skip reference-like noise lines
    if (!/RE\/GS|Turn over|PACE|space for rough/i.test(line)) {
      currentQuestion += " " + line;
    }
  }
}

// Push the last parsed question
if (currentQuestion && currentOptions.length >= 2) {
  questions.push({
    id: parseInt(currentId),
    part: determinePart(currentId),
    lang:  "en",
    question: currentQuestion.trim(),
    options: currentOptions.slice(0, 4),
    answer: isDisputed ? -1 : -1,
    topic: classifyTopic(currentQuestion),
    year: parseInt(year),
    paper_code: paperCode,
    disputed: isDisputed,
  });
}

// Deduplicate by id, keep last occurrence
const seen = new Map();
for (const q of questions) {
  if (q.options.length >= 2) {
    seen.set(q.id, q);
  }
}
const finalQuestions = [...seen.values()].sort((a, b) => a.id - b.id);

// Save
const outDir = "public/data/pyq";
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `tnpsc-${year}-${paperCode}.json`);
const output = {
  meta: {
    exam: "TNPSC Group 2A Paper II",
    year: parseInt(year),
    paper_code: paperCode,
    total_questions: finalQuestions.length,
    disputed: finalQuestions.filter(q => q.disputed).length,
    extracted_at: new Date().toISOString(),
    source_file: path.basename(txtFile),
    note: "Answers set to -1 (OCR cannot read checkmarks). Use extract.mjs with Gemini for accurate answers."
  },
  questions: finalQuestions,
};

fs.writeFileSync(outFile, JSON.stringify(output, null, 2), "utf-8");

const byTopic = finalQuestions.reduce((acc, q) => { acc[q.topic] = (acc[q.topic] || 0) + 1; return acc; }, {});
console.log(`\n✅ Parsed ${finalQuestions.length} questions from OCR text`);
console.log(`⚠️  All answers set to -1 (OCR cannot detect checkmarks — use AI extraction for answers)`);
console.log(`💾 Saved: ${outFile}`);
console.log("\n📊 Questions by topic:");
Object.entries(byTopic).sort((a,b) => b[1]-a[1]).forEach(([t,c]) => console.log(`   ${t}: ${c}`));
