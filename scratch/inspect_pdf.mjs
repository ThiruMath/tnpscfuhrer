import fs from 'node:fs';
import { PDFParse } from 'pdf-parse';

const pdfPath = "./pyq-sources/14000_Chapterwise_Questions_Objective_General_Studies_Manohar_Pandey.pdf";

async function run() {
  console.log("Reading PDF...");
  const dataBuffer = fs.readFileSync(pdfPath);
  
  console.log("Parsing PDF text for pages 3 to 9...");
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText({ first: 9 }); // first 9 pages
  
  console.log("Writing TOC text to scratch/toc_text.txt...");
  // Skip first 2 pages (cover)
  const pagesText = result.pages.slice(2).map(p => `=== PAGE ${p.num} ===\n${p.text}`).join('\n\n');
  fs.writeFileSync('./scratch/toc_text.txt', pagesText, 'utf-8');
  console.log("Done!");
  await parser.destroy();
}

run().catch(console.error);
