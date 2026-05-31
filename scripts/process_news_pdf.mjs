import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

if (!API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY is not defined in the environment or .env file.");
  process.exit(1);
}

const uploadsDir = "./uploads";
const processedDir = "./uploads/processed";
const newsFile = "./public/data/news.json";
const revisionFile = "./public/data/revision.json";
const pyqFile = "./public/data/pyq.json";
const topicNotesFile = "./public/data/topic_notes.json";

// Safe JSON parser helper
function parseJson(rawText) {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

// Main logic
async function main() {
  // Ensure directories exist
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.mkdirSync(processedDir, { recursive: true });

  // Read uploads directory for PDFs
  const files = fs.readdirSync(uploadsDir);
  const pdfFiles = files.filter(f => f.toLowerCase().endsWith(".pdf"));

  if (pdfFiles.length === 0) {
    console.log("📡 No new PDF files found in uploads/ directory. Skipping PDF processing.");
    return;
  }

  console.log(`📁 Found ${pdfFiles.length} PDF file(s) to process.`);

  // Load existing data
  let existingNews = [];
  try {
    if (fs.existsSync(newsFile)) {
      existingNews = JSON.parse(fs.readFileSync(newsFile, "utf-8"));
    }
  } catch (e) {
    console.warn("⚠️ Warning: Could not load news.json, starting with empty array.", e);
  }

  let pyqList = [];
  try {
    if (fs.existsSync(pyqFile)) {
      pyqList = JSON.parse(fs.readFileSync(pyqFile, "utf-8"));
    }
  } catch (e) {
    console.warn("⚠️ Warning: Could not load pyq.json.", e);
  }

  let topicNotes = {};
  try {
    if (fs.existsSync(topicNotesFile)) {
      topicNotes = JSON.parse(fs.readFileSync(topicNotesFile, "utf-8"));
    }
  } catch (e) {
    console.warn("⚠️ Warning: Could not load topic_notes.json.", e);
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL });

  const newsPrompt = `You are a post-doctoral researcher and professional UPSC/TNPSC Current Affairs Analyst.
Analyze the attached PDF document and extract the major current affairs news items relevant to the TNPSC/UPSC exams syllabus.

For each news item, extract:
1. "title": A short, informative headline in English.
2. "summary": A concise 2-3 sentence summary detailing the core facts and its relevance to public exams.
3. "topic": Categorize it strictly into one of the following syllabus areas:
   - "Polity" (Constitution, Parliament, Governance, Judiciary, Elections)
   - "Economy" (Banking, RBI, GDP, Inflation, Budget, Taxes, Fiscal policy)
   - "Science" (Technology, Space, ISRO, Satellites, AI, Biotechnology)
   - "Environment" (Climate change, Pollution, Biodiversity, Conservation)
   - "International Relations" (Foreign policy, Treaties, Agreements, Global summits)
   - "Tamil Nadu" (State affairs, schemes, history, announcements)
   - "History" (Archaeology, Culture, Historical heritage)
   - "Others" (Misc high-yield news)
4. "date": The date of the news publication in YYYY-MM-DD format (if none found, use today's date).
5. "source": The source of the news (e.g. PIB, The Hindu, Indian Express, Govt Portal).
6. "link": The original source link if visible in the document (otherwise return a placeholder or empty string).

STRICT RULES:
1. Output ONLY a valid JSON array of objects. No markdown code blocks (e.g. \`\`\`json), no preamble, no explanations.
2. Extract only educational, high-yield news. Skip political advertisements, gossip, local crimes, or routine announcements.
3. If no relevant news items are found, return an empty array: []

Return format:
[
  {
    "title": "RBI Keeps Repo Rate Unchanged at 6.5%",
    "summary": "The Monetary Policy Committee of the Reserve Bank of India decided to keep the policy repo rate unchanged. This decision aligns with the ongoing stance of accommodation withdrawal to ensure inflation progressively aligns with target levels while supporting growth.",
    "topic": "Economy",
    "date": "2026-05-31",
    "source": "RBI / PIB",
    "link": ""
  }
]`;

  let newlyExtractedNews = [];

  for (const pdfName of pdfFiles) {
    const pdfPath = path.join(uploadsDir, pdfName);
    console.log(`⏳ Processing: ${pdfName}...`);

    try {
      const pdfBuffer = fs.readFileSync(pdfPath);
      const base64Data = pdfBuffer.toString("base64");

      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { inlineData: { mimeType: "application/pdf", data: base64Data } },
            { text: newsPrompt }
          ],
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });

      const parsed = parseJson(result.response.text());
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`✅ Extracted ${parsed.length} news items from ${pdfName}`);
        
        // Post-process items to attach notes & PYQs
        const processedItems = parsed.map(item => {
          // Generate clean slug
          const slug = item.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          // Find matched PYQs
          const attachedPyq = pyqList.filter(q => q.topic === item.topic);

          // Find matched notes
          const attachedNotes = topicNotes[item.topic] || [];

          return {
            ...item,
            slug,
            pyq: attachedPyq,
            notes: attachedNotes
          };
        });

        newlyExtractedNews.push(...processedItems);
      } else {
        console.log(`ℹ️ No news items extracted from ${pdfName}`);
      }

      // Move processed file to archive
      let targetPath = path.join(processedDir, pdfName);
      if (fs.existsSync(targetPath)) {
        // If file already exists in processed/, append timestamp to avoid collision
        const ext = path.extname(pdfName);
        const base = path.basename(pdfName, ext);
        targetPath = path.join(processedDir, `${base}-${Date.now()}${ext}`);
      }
      fs.renameSync(pdfPath, targetPath);
      console.log(`📦 Archived ${pdfName} to uploads/processed/`);

    } catch (e) {
      console.error(`❌ Error processing ${pdfName}:`, e);
    }
  }

  if (newlyExtractedNews.length === 0) {
    console.log("ℹ️ No new articles were extracted. News list unchanged.");
    return;
  }

  // Merge, deduplicate by title, and limit to freshest 30 items
  let combinedNews = [...newlyExtractedNews, ...existingNews];
  const seenTitles = new Set();
  const deduplicatedNews = [];

  for (const item of combinedNews) {
    const key = item.title.toLowerCase().trim();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      deduplicatedNews.push(item);
    }
  }

  const finalNews = deduplicatedNews.slice(0, 30);
  
  // Ensure output directory exists
  fs.mkdirSync(path.dirname(newsFile), { recursive: true });
  fs.writeFileSync(newsFile, JSON.stringify(finalNews, null, 2), "utf-8");
  console.log(`💾 Saved ${finalNews.length} articles to ${newsFile}`);

  // Component 3: Generate Daily Revision Questions
  console.log("🤖 Generating daily revision set using Gemini...");
  await generateRevisionSet(finalNews);
}

// AI-powered revision generator
async function generateRevisionSet(articlesList) {
  if (articlesList.length === 0) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Format articles for prompt context
  const articleContext = articlesList.slice(0, 8).map((a, i) => `
Article ${i+1}:
Title: ${a.title}
Topic: ${a.topic}
Summary: ${a.summary}
Source: ${a.source}
Link: ${a.link || 'None'}
  `).join("\n");

  const prompt = `You are a professional educational designer and exam coach for UPSC/TNPSC.
Given the following list of recent news articles, generate a daily revision set of exactly 5 practice questions for today: ${todayStr}.

Create a structured JSON object containing:
1. "date": The current date in YYYY-MM-DD format (use "${todayStr}").
2. "questions": An array of exactly 5 objects. Each object must have:
   - "question": The question text. Make it highly educational and specific to the syllabus or the news.
   - "topic": The syllabus category (e.g. Economy, Polity, Science, Environment, International Relations, Tamil Nadu, History).
   - "source": Must be exactly one of "concept", "news", or "pyq".
     - Generate exactly 2 "concept" questions (asking to explain/explore core syllabus concepts mentioned in the news).
     - Generate exactly 2 "news" questions (asking about the implications/specific details of the news articles).
     - Generate exactly 1 "pyq" question (either a real standard UPSC/TNPSC question or a direct simulation matching the topics of today's news).
   - "reference":
     - For "news" source, set this to the link of the article if it exists (otherwise omit or set empty).
     - For "concept" source, you can provide hints.

STRICT RULES:
1. Output ONLY a valid JSON object. Do not wrap in markdown \`\`\`json blocks.
2. The questions should be challenging, clear, and relevant to the civil services exams.

Here is the news context:
${articleContext}

Output JSON format template:
{
  "date": "${todayStr}",
  "questions": [
    {
      "question": "What is inflation and how does the RBI control it?",
      "topic": "Economy",
      "source": "concept"
    }
  ]
}`;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    const parsed = parseJson(result.response.text());
    
    if (parsed && parsed.questions && parsed.questions.length > 0) {
      // Save current revision
      fs.writeFileSync(revisionFile, JSON.stringify(parsed, null, 2), "utf-8");
      console.log(`💾 Saved daily revision questions to ${revisionFile}`);

      // Save to revision history archive
      const historyDir = "./public/data/revision-history";
      fs.mkdirSync(historyDir, { recursive: true });
      fs.writeFileSync(path.join(historyDir, `${todayStr}.json`), JSON.stringify(parsed, null, 2), "utf-8");
      console.log(`📦 Archived daily revision to ${historyDir}/${todayStr}.json`);
    } else {
      console.warn("⚠️ Warning: Received empty or invalid revision questions object from API.");
    }
  } catch (e) {
    console.error("❌ Error generating daily revision questions:", e);
  }
}

main().catch(err => {
  console.error("❌ Fatal Error in PDF news pipeline:", err);
  process.exit(1);
});
