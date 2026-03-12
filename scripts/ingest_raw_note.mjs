import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import 'dotenv/config'; // Requires dotenv
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const NOTES_DIR = path.join(process.cwd(), 'src', 'content', 'notes');

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.txt', '.md', '.csv', '.rtf'].includes(ext)) {
    return await fs.readFile(filePath, 'utf-8');
  } else if (ext === '.pdf') {
    const dataBuffer = fsSync.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }
}

async function ingestNote() {
  const args = process.argv.slice(2);
  const inputFilePath = args[0];

  if (!inputFilePath) {
    console.error('Usage: node scripts/ingest_raw_note.mjs <path-to-file>');
    console.error('Example: node scripts/ingest_raw_note.mjs ./downloads/history_notes_rough.pdf');
    process.exit(1);
  }

  const absolutePath = path.resolve(inputFilePath);
  
  if (!fsSync.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Please set GEMINI_API_KEY in your .env file.");
    process.exit(1);
  }

  console.log(`\nExtracting text from ${path.basename(absolutePath)}...`);
  
  try {
    const content = await extractText(absolutePath);
    console.log(`Extracted ${content.length} characters. Generating structured study note...`);

    const prompt = `You are an expert TNPSC and UPSC study content creator. 
I am providing you with raw, unstructured text (possibly from a PDF extraction).
Your task is to:
1. Generate appropriate frontmatter for Astro Markdown content strictly following this schema:
   title: string (create a concise, catchy title)
   description: string (1-2 sentence summary)
   subject: string (e.g., History, Polity, Geography, Economy, etc.)
   exam: array of strings (e.g., ['TNPSC'], ['UPSC'], ['TNPSC', 'UPSC'])
   topics: array of strings (3-5 relevant keyword tags)
   difficulty: string ('easy', 'medium', or 'hard')
   last_updated: date (use today's date in YYYY-MM-DD format)
   source_references: array of strings (e.g., ['Ingested from ${path.basename(absolutePath)}'])
2. Read the raw text and restructure it beautifully into an organized Markdown study note.
3. Clean up any weird PDF formatting, OCR artifacts, or broken lines.
4. Use clear ## and ### headings, bold text for key terms, and bullet points where helpful. 

Raw Text:
${content}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: "You must return ONLY the raw markdown content starting with the --- frontmatter block. Do not wrap it in a code block."}] }
        })
      }
    );

    const data = await res.json();
    
    if (data.error) throw new Error(data.error.message);

    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedContent) {
       // Clean up accidentally added codeblock wrappers
       const cleanedContent = generatedContent.replace(/^```markdown\n/, '').replace(/\n```$/, '');
       
       // Try to extract title for the filename
       const titleMatch = cleanedContent.match(/title:\s*["']?([^"'\n]+)["']?/);
       let slug = path.basename(absolutePath, path.extname(absolutePath)).toLowerCase().replace(/[^a-z0-9]+/g, '-');
       
       if (titleMatch && titleMatch[1]) {
           slug = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
       }
       
       const outFilePath = path.join(NOTES_DIR, `${slug}.md`);
       
       await fs.writeFile(outFilePath, cleanedContent, 'utf-8');
       console.log(`\n✅ Successfully generated note! Saved to: src/content/notes/${slug}.md`);
    } else {
       console.log("No content returned from AI.");
    }

  } catch (error) {
    console.error(`\nFailed to ingest note:`, error);
  }
}

ingestNote();
