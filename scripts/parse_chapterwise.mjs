import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { PDFParse } from 'pdf-parse';
import 'dotenv/config'; // Load API key from .env

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";
const RATE_LIMIT_DELAY_MS = 4000; // 4s delay between calls

// Read command line arguments
// Example: node scripts/parse_chapterwise.mjs --subject history --chapter 1
const args = process.argv.slice(2);
let subjectArg = '';
let chapterArg = null;
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--subject') {
    subjectArg = args[i + 1];
  } else if (args[i] === '--chapter') {
    chapterArg = parseInt(args[i + 1], 10);
  } else if (args[i] === '--dry-run') {
    dryRun = true;
  }
}

if (!subjectArg || !chapterArg) {
  console.error("❌ Usage: node scripts/parse_chapterwise.mjs --subject <subject-id> --chapter <chapter-number> [--dry-run]");
  console.error("Example: node scripts/parse_chapterwise.mjs --subject history --chapter 1");
  process.exit(1);
}

if (!API_KEY && !dryRun) {
  console.error("❌ Set your GEMINI_API_KEY in the .env file!");
  process.exit(1);
}

const INDEX_PATH = './public/data/pyq-chapterwise/index.json';
const PDF_PATH = './pyq-sources/14000_Chapterwise_Questions_Objective_General_Studies_Manohar_Pandey.pdf';

// Constant offset: Book Page 1 = PDF Page 10 (offset is +9)
const PDF_PAGE_OFFSET = 9;

const SYSTEM_PROMPT = `You are an expert General Studies question paper digitizer.
Extract every question from this single page of the book and return a JSON array.

STRICT RULES:
1. Extract ALL questions visible on this page. Never skip any.
2. Return ONLY a raw JSON array. Do not include markdown fences like \`\`\`json, no explanation, no extra text.
3. If there are NO questions on this page, return an empty array: []
4. Each question object must have EXACTLY these fields:
   - "id"         : integer — question number as printed on the page (e.g. 1, 2, 3...)
   - "question"   : string — full question text in English.
   - "options"    : array of 4 strings — choices (a), (b), (c), (d) only. Clean up prefix labels like "(a)", "(b)" from the text.
   - "answer"     : integer — 0-indexed correct answer (0=A, 1=B, 2=C, 3=D).
                    Determine this correct answer by checking the answer key printed at the bottom of the page (e.g. "1. (a) 2. (c) 3. (b) ..."). Match the question ID with the correct option letter.
   - "explanation": string — leave empty string "" or extract any context if present.
   - "exam_info"  : string — any exam reference in square brackets next to the question (e.g. "CDS 2018", "UPPSC 1996"). If none, use empty string "".
`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  // 1. Load catalog index
  if (!fs.existsSync(INDEX_PATH)) {
    console.error(`❌ Catalog index not found at ${INDEX_PATH}. Please run parse_toc.mjs first.`);
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
  
  // 2. Find the requested subject and chapter
  let targetSubject = null;
  let targetSubSubject = null;
  let targetChapter = null;

  for (const subj of catalog) {
    if (subj.id === subjectArg) {
      targetSubject = subj;
      // Search in sub_subjects
      for (const subSub of subj.sub_subjects) {
        const chap = subSub.chapters.find(c => c.number === chapterArg);
        if (chap) {
          targetSubSubject = subSub;
          targetChapter = chap;
          break;
        }
      }
    }
    if (targetChapter) break;
  }

  if (!targetChapter) {
    console.error(`❌ Chapter ${chapterArg} not found under subject "${subjectArg}" in the catalog.`);
    process.exit(1);
  }

  const [bookStart, bookEnd] = targetChapter.book_pages;
  const pdfStart = bookStart + PDF_PAGE_OFFSET;
  const pdfEnd = bookEnd + PDF_PAGE_OFFSET;

  console.log(`\n📚 Chapter found: "${targetChapter.name}"`);
  console.log(`📂 Subject: ${targetSubject.name} | Sub-Subject: ${targetSubSubject.name || 'N/A'}`);
  console.log(`📖 Book Pages: ${bookStart}–${bookEnd} | 📑 PDF Pages to extract: ${pdfStart}–${pdfEnd} (${pdfEnd - pdfStart + 1} pages)\n`);

  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ Source PDF not found at ${PDF_PATH}`);
    process.exit(1);
  }

  // 3. Extract text from PDF
  console.log("Reading PDF...");
  const dataBuffer = fs.readFileSync(PDF_PATH);
  const parser = new PDFParse({ data: dataBuffer });
  
  console.log(`Extracting text for PDF pages ${pdfStart} to ${pdfEnd}...`);
  const textResult = await parser.getText({
    first: pdfStart,
    last: pdfEnd,
  });

  // Let's filter only pages that fall in [pdfStart, pdfEnd] range
  const targetPages = textResult.pages.filter(p => p.num >= pdfStart && p.num <= pdfEnd);
  
  console.log(`Extracted ${targetPages.length} pages of text.`);
  await parser.destroy();

  if (dryRun) {
    console.log("⚡ Dry run enabled. Printing extracted text of first page:");
    if (targetPages.length > 0) {
      console.log(targetPages[0].text.substring(0, 1000));
    }
    console.log("\n✅ Dry run finished successfully.");
    process.exit(0);
  }

  // 4. Send page-by-page to Gemini
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL });
  let allQuestions = [];

  for (let i = 0; i < targetPages.length; i++) {
    const pageObj = targetPages[i];
    console.log(`\n⏳ Ingesting Page ${pageObj.num} (Book Page ${pageObj.num - PDF_PAGE_OFFSET})...`);

    try {
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: `Page Text:\n${pageObj.text}` },
            { text: SYSTEM_PROMPT }
          ],
        }],
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json"
        },
      });

      const raw = result.response.text().trim();
      let parsed = JSON.parse(raw);

      if (parsed.length > 0) {
        console.log(`✅ Extracted ${parsed.length} questions from Page ${pageObj.num}`);
        allQuestions = allQuestions.concat(parsed);
      } else {
        console.log(`ℹ️ No questions found on Page ${pageObj.num}`);
      }
    } catch (e) {
      console.error(`❌ Error parsing Page ${pageObj.num}:`, e.message);
    }

    if (i < targetPages.length - 1) {
      console.log(`⏱️ Waiting ${RATE_LIMIT_DELAY_MS / 1000}s to respect rate limits...`);
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  }

  // 5. Save combined output file
  const output = {
    meta: {
      subject: targetSubject.name,
      sub_subject: targetSubSubject.name,
      chapter_number: targetChapter.number,
      chapter_name: targetChapter.name,
      total_questions: allQuestions.length,
      source_book: "Objective General Studies 14000+Q",
      extracted_at: new Date().toISOString()
    },
    questions: allQuestions
  };

  const outDir = path.join('public', 'data', 'pyq-chapterwise', subjectArg);
  const outFile = path.join(outDir, `${targetChapter.id}.json`);
  
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n🎉 Ingestion Complete!`);
  console.log(`💾 Saved ${allQuestions.length} questions to: ${outFile}\n`);
}

run().catch(err => {
  console.error("❌ Fatal Ingestion Error:", err.stack || err.message);
  process.exit(1);
});
