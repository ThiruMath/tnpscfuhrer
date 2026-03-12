// src/pages/api/notes.ts
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const POST: APIRoute = async ({ request }) => {
  const { topic } = await request.json() as { topic: string };

  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'notes', `${topic}.md`);
    
    // Read local markdown content
    let originalNotes = '';
    if (fs.existsSync(filePath)) {
      originalNotes = fs.readFileSync(filePath, 'utf-8');
    } else {
      return new Response(JSON.stringify({ error: `Note not found for topic: ${topic}` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = import.meta.env.GEMINI_API_KEY;

    // Remove frontmatter from the markdown before sending or sending directly back
    const contentBody = originalNotes.replace(/^---[\s\S]+?---\s*/, '');

    if (!apiKey) {
      // If no API key, just return the original notes
      return new Response(JSON.stringify({ text: contentBody }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a TNPSC exam study assistant. Please rephrase and improve the following study notes on "${topic}". Make them highly structured with ## headers, bullet points, and bold key terms. Be concise, accurate, and exam-focused.\n\nHere are the original notes:\n${contentBody}`
            }]
          }]
        })
      }
    );

    const data = await res.json() as any;

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return new Response(JSON.stringify({ text: contentBody, error: "AI rephrase failed, showing original." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? contentBody;

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};