import fs from 'node:fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'; // Loads env vars from .env

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("No GEMINI_API_KEY found!");
  process.exit(1);
}

const tocText = fs.readFileSync('./scratch/toc_text.txt', 'utf-8');

const SYSTEM_PROMPT = `You are a data extraction assistant.
Parse the following Table of Contents (TOC) of a General Studies question bank and return a JSON array listing all subjects, sub-subjects (if any), chapters, and their book page ranges.

Schema specification:
Return a JSON array of Subject objects. Each Subject has:
- "id": string (lowercase URL-friendly slug, e.g. "history", "geography", "indian-polity", "indian-economy", "general-science", "general-knowledge")
- "name": string (clean subject name, e.g. "History", "Geography", "Indian Polity", "Indian Economy", "General Science", "General Knowledge")
- "sub_subjects": array of SubSubject objects.
  Each SubSubject has:
  - "name": string (e.g. "Ancient History", "World Geography", "Physics", or empty string "" if there is no sub-subject)
  - "chapters": array of Chapter objects.
    Each Chapter has:
    - "id": string (lowercase URL-friendly slug, e.g. "ancient-sources", "universe-solar-system")
    - "number": integer (chapter number as printed, e.g. 1, 2, 3...)
    - "name": string (clean chapter name, e.g. "Historical Sources and Pre-Historic Period")
    - "book_pages": array of 2 integers [start_page, end_page]

Rules:
1. Parse ALL subjects and chapters listed in the TOC.
2. Return ONLY the raw JSON array. Do not include markdown fences like \`\`\`json or any other text.
3. Be careful to match page numbers correctly (e.g. "1. Universe and Solar System 228-232" -> book_pages: [228, 232]).
4. For "Art, Culture and Cultural Traditions 195-216" and "World History 217-227", group them under "History" with sub-subject name "Art, Culture & World History" or similar.
5. For Environment & Ecology, group them under "Geography" or keep them as part of geography with sub-subject "Environment & Ecology".
6. For Physics, Chemistry, Biology, Science & Technology, group them under "General Science".
7. Ensure IDs are URL-friendly: lowercase, using hyphens instead of spaces or special characters.
`;

async function run() {
  console.log("Initializing Gemini...");
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  console.log("Sending TOC to Gemini...");
  const result = await model.generateContent({
    contents: [{
      role: "user",
      parts: [
        { text: tocText },
        { text: SYSTEM_PROMPT }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });

  const responseText = result.response.text().trim();
  
  // Verify it is valid JSON
  try {
    const parsed = JSON.parse(responseText);
    const outPath = "./public/data/pyq-chapterwise/index.json";
    fs.mkdirSync("./public/data/pyq-chapterwise", { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf-8');
    console.log(`Success! Saved TOC index to ${outPath}`);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:");
    console.log(responseText);
    console.error(e);
  }
}

run().catch(console.error);
