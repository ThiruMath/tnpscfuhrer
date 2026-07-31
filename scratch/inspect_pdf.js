import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const pdfPath = "./pyq-sources/14000_Chapterwise_Questions_Objective_General_Studies_Manohar_Pandey.pdf";

async function run() {
  console.log("Reading PDF...");
  const dataBuffer = fs.readFileSync(pdfPath);
  
  console.log("Parsing PDF metadata...");
  const data = await pdfParse(dataBuffer, {
    max: 15 // Limit parsing to first 15 pages
  });
  
  console.log("--- Metadata ---");
  console.log("Pages:", data.numpages);
  console.log("Info:", data.info);
  console.log("\n--- Text from first 15 pages ---");
  console.log(data.text);
}

run().catch(console.error);
