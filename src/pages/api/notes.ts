// src/pages/api/notes.ts
// Place this file at: src/pages/api/notes.ts

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { topic } = await request.json() as { topic: string };

  const apiKey = import.meta.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
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
            text: `You are a TNPSC exam study assistant. Give well-structured markdown study notes for: "${topic}". Use ## headers, bullet points, and bold key terms. Be concise, accurate, and exam-focused.`
          }]
        }]
      })
    }
  );

  const data = await res.json() as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No content available.';

  return new Response(JSON.stringify({ text }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};