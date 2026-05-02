import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPT = `You are a post-doctoral researcher specializing in Tamil literature,
political history, and archaeology. Write a complete scholarly profile for the Tamil [TYPE]: [NAME].

Follow this exact structure:

1. Identity/Overview (2-3 paragraphs) — biographical facts vs legend, what we actually know vs what tradition says, their social position, caste background, religious affiliation.
2. Historical & Political Context (2-3 paragraphs) — which dynasty ruled when they lived, what the political situation was, how that shaped their writing, trade routes and material conditions if relevant.
3. Signature Style/Structure — their metre, their imagery, what makes them technically distinctive from other poets of their period.
4. Ethics & Philosophy / What it says — what their actual writing argues about how to live, about power, about death, about social order.
5. 2 Key Poems (MUST INCLUDE REAL TAMIL TEXT):
   - Tamil original text (in Noto Sans Tamil script)
   - Literal English translation (not a paraphrase)
   - Line-by-line commentary (what each image actually means)
   - Political note (how this poem functions as a historical document)
   - TN school syllabus grade reference if applicable
6. Legacy / Greek-Latin Compare — how they influenced later literature, how they are used in modern Tamil political discourse. Compare to Greek, Latin, and Sanskrit literature of the same period.

Do NOT soften political content. The Kalabhra erasure, caste violence, religious conflict, and gender restrictions should be named directly.
DO compare to Greek, Latin, and Sanskrit literature of the same period.

OUTPUT FORMAT:
Generate ONLY a raw, valid JSON object with the following properties:
[SHAPE]
Ensure the JSON is perfectly formed. Do not output markdown code blocks like \`\`\`json.`;

const poetShapeStr = `
{
  "slug": "string",
  "name": "string",
  "tamil": "string",
  "period": "string",
  "era_label": "string",
  "dates": "string",
  "religion": "string",
  "region": "string",
  "known_for": "string",
  "icon": "string",
  "accent": "string",
  "identity": "string",
  "historical_context": "string",
  "signature_style": "string",
  "ethical_philosophical": "string",
  "key_poems": [
    {
      "source": "string",
      "grade": "string",
      "tamil": "string",
      "translation": "string",
      "commentary": "string",
      "political_note": "string"
    }
  ],
  "legacy": "string",
  "works": ["string"],
  "project_madurai": "string",
  "tamilvu": "string"
}`;

const workShapeStr = `
{
  "slug": "string",
  "title": "string",
  "tamil": "string",
  "author": "string",
  "author_slug": "string",
  "period": "string",
  "era_label": "string",
  "dates": "string",
  "form": "string",
  "metre": "string",
  "verses": "string",
  "language": "string",
  "religion_context": "string",
  "overview": "string",
  "political_context": "string",
  "structure": {
    "overview": "string",
    "books": [
      {
        "name": "string",
        "meaning": "string",
        "sutras": 100,
        "chapters": "string",
        "content": "string"
      }
    ]
  },
  "what_it_says": "string",
  "key_poems": [
    {
      "source": "string",
      "grade": "string",
      "tamil": "string",
      "translation": "string",
      "commentary": "string",
      "political_note": "string"
    }
  ],
  "greek_latin_compare": "string",
  "school_syllabus": [
    { "grade": "string", "content": "string" }
  ],
  "project_madurai": "string",
  "tamilvu": "string"
}`;

async function generateContent(type, name) {
  const shape = type === 'poet' ? poetShapeStr : workShapeStr;
  const prompt = PROMPT.replace('[TYPE]', type).replace('[NAME]', name).replace('[SHAPE]', shape);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });
  console.log(`Generating ${type}: ${name}...`);
  try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
  } catch(e) {
      console.log(`Failed for ${name}`, e);
      return null;
  }
}

async function main() {
  const poetsToAdd = ['nakkirar', 'sithalai-sattanar', 'tiruttakkatevar', 'thirugnanasambandar', 'appar', 'sundarar', 'periyalvar', 'sekkizhar', 'avvaiyar-medieval'];
  const worksToAdd = ['kurunthokai', 'natrinai', 'akananuru', 'kurinjipattu', 'pattinapalai', 'manimekalai', 'civaka-cintamani', 'naladiyar', 'tevaram', 'thiruvasagam', 'thiruvaymoli', 'thirupavai', 'kambaramayanam', 'periyapuranam'];
  
  let poetsFile = fs.readFileSync('src/data/poets.js', 'utf8');
  let worksFile = fs.readFileSync('src/data/works.js', 'utf8');

  console.log('Generating poets...');
  for (const p of poetsToAdd) {
    if (poetsFile.includes(`slug: "${p}"`) || poetsFile.includes(`"slug": "${p}"`)) {
        console.log(`Skipping ${p}, already exists.`);
        continue;
    }
    const res = await generateContent('poet', p);
    if(res) {
      const poetInsertIdx = poetsFile.lastIndexOf(']');
      poetsFile = poetsFile.substring(0, poetInsertIdx) + ',\\n' + JSON.stringify(res, null, 2) + '\\n' + poetsFile.substring(poetInsertIdx);
      fs.writeFileSync('src/data/poets.js', poetsFile);
    }
    await new Promise(r => setTimeout(r, 4500));
  }

  console.log('Generating works...');
  for (const w of worksToAdd) {
    if (worksFile.includes(`slug: "${w}"`) || worksFile.includes(`"slug": "${w}"`)) {
        console.log(`Skipping ${w}, already exists.`);
        continue;
    }
    const res = await generateContent('work', w);
    if(res) {
      const workInsertIdx = worksFile.lastIndexOf(']');
      worksFile = worksFile.substring(0, workInsertIdx) + ',\\n' + JSON.stringify(res, null, 2) + '\\n' + worksFile.substring(workInsertIdx);
      fs.writeFileSync('src/data/works.js', worksFile);
    }
    await new Promise(r => setTimeout(r, 4500));
  }

  console.log('Done generating data.');
}

main().catch(console.error);
