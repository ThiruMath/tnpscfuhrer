import fs from 'node:fs/promises';
import path from 'node:path';
import 'dotenv/config'; // Make sure dotenv is installed

const NOTES_DIR = path.join(process.cwd(), 'src', 'content', 'notes');
const STATE_FILE = path.join(process.cwd(), 'notes_processing_state.json');
const DAILY_BATCH_LIMIT = 10;
const DELAY_BETWEEN_REQUESTS = 2000;

async function processNotes() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Please set GEMINI_API_KEY in your .env file.");
    process.exit(1);
  }

  // Load state
  let state = { lastProcessedIndex: -1 };
  try {
    const stateData = await fs.readFile(STATE_FILE, 'utf-8');
    state = JSON.parse(stateData);
  } catch (error) {
    console.log("No state file found, starting from beginning.");
  }

  const allFiles = (await fs.readdir(NOTES_DIR)).filter(file => file.endsWith('.md')).sort();
  
  if (allFiles.length === 0) {
    console.log("No markdown files found in notes directory.");
    return;
  }

  // Determine starting index
  let startIndex = state.lastProcessedIndex + 1;
  if (startIndex >= allFiles.length) {
    console.log("All files processed, resetting to beginning.");
    startIndex = 0;
  }

  let processedThisRun = 0;
  let attemptsThisRun = 0;
  let currentIndex = startIndex;

  console.log(`Starting batch from index ${startIndex}. Limit: ${DAILY_BATCH_LIMIT}`);

  try {
    while (processedThisRun < DAILY_BATCH_LIMIT && attemptsThisRun < DAILY_BATCH_LIMIT * 2 && currentIndex < allFiles.length) {
      const file = allFiles[currentIndex];
      const filePath = path.join(NOTES_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');

      // Skip if it already has frontmatter
      if (content.startsWith('---')) {
        console.log(`[${currentIndex + 1}/${allFiles.length}] Skipping ${file} - already has frontmatter.`);
        currentIndex++;
        continue;
      }

      console.log(`[${currentIndex + 1}/${allFiles.length}] Processing ${file}...`);
      attemptsThisRun++;

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
           
           // If quota exceeded, stop the run
           if (data.error.message.includes('quota') || data.error.status === 'RESOURCE_EXHAUSTED') {
             console.log("Quota exceeded. Stopping this run.");
             break;
           }
           
           currentIndex++;
           continue; 
        }

        const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedContent) {
           const cleanedContent = generatedContent.replace(/^```markdown\n/, '').replace(/\n```$/, '');
           await fs.writeFile(filePath, cleanedContent, 'utf-8');
           console.log(`Successfully rewrote ${file}`);
           processedThisRun++;
        }

        // Add sleep to prevent rate limits
        await new Promise(r => setTimeout(r, DELAY_BETWEEN_REQUESTS));

      } catch (error) {
        console.error(`Failed to process ${file}:`, error);
      }
      
      currentIndex++;
    }
  } finally {
    // Update state even if we hit an error or quota
    state.lastProcessedIndex = currentIndex - 1;
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    console.log(`Run complete. Processed ${processedThisRun} files. Last index processed: ${state.lastProcessedIndex}`);
  }
}


processNotes();

