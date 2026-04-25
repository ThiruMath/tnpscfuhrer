import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

// ─── CONFIG ───────────────────────────────────────────────
const API_KEY = process.env.GEMINI_API_KEY; // set in terminal
const MODEL = "gemini-2.5-flash";          // free tier
const RATE_LIMIT_DELAY_MS = 4000;          // 4s delay between pages (15 RPM free tier)
// ──────────────────────────────────────────────────────────

const [, , filePath, year = "0", paperCode = ""] = process.argv;

if (!filePath) {
  console.error("Usage: node --env-file=.env extract.mjs <file.pdf> [year] [paper_code]");
  console.error("Example: node --env-file=.env extract.mjs part1.pdf 2026 GRP2A");
  process.exit(1);
}

if (!API_KEY) {
  console.error("Set your Gemini API key first!");
  process.exit(1);
}

const SYSTEM_PROMPT = `You are an expert TNPSC/UPSC question paper digitizer.
Extract every question from this single page of the question paper and return a JSON array.

STRICT RULES:
1. Extract ALL questions visible on this page. Never skip any.
2. Return ONLY a raw JSON array. No markdown fences like \`\`\`json, no explanation, no extra text.
3. If there are NO questions on this page (e.g., cover page, rough work area), return an empty array: []
4. Each question object must have EXACTLY these fields:
   - "id"         : integer — question number as printed on paper
   - "part"       : string — "A" or "B" (based on paper section, guess if unclear)
   - "lang"       : string — "en" (English questions only, ignore Tamil translation)
   - "question"   : string — full question text in English only
   - "options"    : array of 4 strings — choices (A), (B), (C), (D) only, no (E)
   - "answer"     : integer — 0-indexed correct answer (0=A, 1=B, 2=C, 3=D)
                    Use -1 if marked "TO BE PLACED BEFORE EXPERT COMMITTEE"
                    or if no answer is marked
   - "topic"      : string — one of: "History", "Polity", "Economy", "Geography",
                    "Science", "Environment", "Current Affairs", "Tamil Literature",
                    "Aptitude", "Reasoning", "English"
   - "year"       : integer — ${year}
   - "paper_code" : string — "${paperCode}"

5. The correct answer is usually shown by a checkmark (✓ or √) next to (A), (B), (C), or (D).
6. Each question appears TWICE on the page — once in English, once in Tamil. Extract the ENGLISH version only. Option (E) "Answer not known" — DO NOT include.

Return format example:
[
  {
    "id": 1,
    "part": "A",
    "lang": "en",
    "question": "Which of the following...",
    "options": ["option A", "option B", "option C", "option D"],
    "answer": 2,
    "topic": "History",
    "year": ${year},
    "paper_code": "${paperCode}"
  }
]`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function extract() {
  console.log(`\n📄 Reading: ${filePath}`);
  
  const fileData = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileData);
  const totalPages = pdfDoc.getPageCount();
  
  console.log(`📑 Total Pages to Process: ${totalPages}`);
  console.log(`📅 Year: ${year} | 📋 Code: ${paperCode}`);
  console.log(`🤖 Model: ${MODEL}\n`);

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL });

  let allQuestions = [];

  for (let i = 0; i < totalPages; i++) {
    console.log(`\n⏳ Processing Page ${i + 1} of ${totalPages}...`);
    
    // Create single-page PDF
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save();
    const base64Data = Buffer.from(pdfBytes).toString('base64');

    try {
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { inlineData: { mimeType: "application/pdf", data: base64Data } },
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
          maxOutputTokens: 8192,
        },
      });

      const raw = result.response.text().trim();
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      
      let parsed = [];
      try {
        if (cleaned && cleaned !== "[]" && cleaned !== "") {
          parsed = JSON.parse(cleaned);
        }
      } catch (err) {
        console.error(`❌ JSON parse failed on page ${i + 1}. Skipping page.`);
        // Write to temp dir handling cross-platform paths
        const tmpDir = process.env.TEMP || process.env.TMP || '/tmp';
        fs.writeFileSync(path.join(tmpDir, `raw_output_page_${i+1}.txt`), raw);
      }

      if (parsed.length > 0) {
        console.log(`✅ Extracted ${parsed.length} questions from page ${i + 1}`);
        allQuestions = allQuestions.concat(parsed);
      } else {
        console.log(`ℹ️ No questions found on page ${i + 1}`);
      }
      
    } catch (e) {
      console.error(`❌ API Error on page ${i + 1}: ${e.message}`);
    }

    if (i < totalPages - 1) {
      console.log(`⏱️ Waiting ${RATE_LIMIT_DELAY_MS/1000}s to respect free-tier rate limits...`);
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  }

  // Save final combined output
  const output = {
    meta: {
      exam: "TNPSC Group 2A",
      paper_code: paperCode,
      total_questions: allQuestions.length,
      extracted_at: new Date().toISOString(),
      source_file: path.basename(filePath),
      model: MODEL,
    },
    questions: allQuestions,
  };

  const outDir = "public/data/pyq";
  const outFile = `${outDir}/tnpsc-${year}-${paperCode || "paper"}.json`;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(output, null, 2), "utf-8");

  console.log(`\n🎉 Done! ${allQuestions.length} TOTAL questions extracted.`);
  console.log(`💾 Saved to: ${outFile}`);
}

extract().catch(err => {
  console.error("\n❌ Fatal Error:", err.message);
  process.exit(1);
});
