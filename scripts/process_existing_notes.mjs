import fs from 'node:fs/promises';
import path from 'node:path';
import 'dotenv/config'; // Make sure dotenv is installed

const NOTES_DIR = path.join(process.cwd(), 'src', 'content', 'notes');
const BATCH_SIZE = 5; // Adjust based on rate limits

async function processNotes() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Please set GEMINI_API_KEY in your .env file.");
    process.exit(1);
  }

  const files = await fs.readdir(NOTES_DIR);
  let processed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(NOTES_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // Skip if it already has frontmatter
    if (content.startsWith('---')) {
      console.log(`Skipping ${file} - already processed.`);
      continue;
    }

    console.log(`[${i + 1}/${files.length}] Processing ${file}...`);

    try {
      const prompt = `You are an expert TNPSC and UPSC study content creator. 
I am going to provide you with raw text for a study note. Your task is to:
1. Generate appropriate frontmatter for Astro Markdown content strictly following this schema:
   title: string
   description: string
   subject: string (e.g., History, Polity, Geography, Economy, etc.)
   exam: array of strings (e.g., ['TNPSC'], ['UPSC'], ['TNPSC', 'UPSC'])
   topics: array of strings (relevant keyword tags)
   difficulty: string ('easy', 'medium', or 'hard')
   last_updated: date (use today's date in YYYY-MM-DD format)
2. Read the raw text and restructure it beautifully into an organized Markdown note. Use clear ## and ### headings, bold text for key terms, and bullet points where helpful. Ensure it's exam-focused.

Raw Text for file "${file}": 
${content}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: "You must return ONLY the raw markdown content starting with the --- frontmatter block. Do not wrap it in a code block like ```markdown."}] }
          })
        }
      );

      const data = await res.json();
      
      if (data.error) {
         console.error(`Error processing ${file}:`, data.error.message);
         continue; // Keep trying other files
      }

      const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedContent) {
         // Clean up if it returned code block formatting by accident
         const cleanedContent = generatedContent.replace(/^```markdown\n/, '').replace(/\n```$/, '');
         await fs.writeFile(filePath, cleanedContent, 'utf-8');
         console.log(`Successfully rewrote ${file}`);
         processed++;
      }

      // Add sleep to prevent rate limits
      await new Promise(r => setTimeout(r, 2000));

    } catch (error) {
      console.error(`Failed to process ${file}:`, error);
    }
  }

  console.log(`Finished processing! Structured ${processed} files.`);
}

processNotes();
