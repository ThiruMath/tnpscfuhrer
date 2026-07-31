# Tamil Literature Site — Build Instructions for Antigravity
# Complete Technical Handoff Document

---

## WHAT YOU ARE BUILDING

A deeply researched, bilingual (Tamil + English) academic website on the
history of Tamil literature — based on Mu. Varadarajan's Tamil Ilakkiya
Varalaru. This is not a blog or a simple content site. It is a structured
scholarly resource covering 2,000+ years of literary history with full
political, social, and archaeological context.

The site is built in Astro (static site generator) and is already
complete. You need to deploy it. The zip file contains the full source.

---

## QUICK DEPLOY (If Antigravity supports Astro / Node.js)

### Step 1 — Extract the zip
Unzip tamil-literature-astro-v2.zip
You will get a folder called: tamil-lit/

### Step 2 — Install dependencies
cd tamil-lit
npm install

### Step 3 — Build
npm run build
Output goes to: tamil-lit/dist/
This is a fully static site — pure HTML/CSS/JS. No server needed.

### Step 4 — Deploy
Upload the contents of tamil-lit/dist/ to Antigravity.
OR point Antigravity's build command to: npm run build
And set publish directory to: dist

### Build Settings for Antigravity Dashboard
| Setting              | Value              |
|----------------------|--------------------|
| Framework            | Astro              |
| Build Command        | npm run build      |
| Publish Directory    | dist               |
| Node Version         | 18+ recommended    |
| Install Command      | npm install        |

---

## FULL SITE STRUCTURE

The site has 24 pages across these routes:

/                    → Homepage — six literary periods, entry point
/history             → Full narrative literary history (MuVa framework)
/sangam              → Sangam age — Ettuthokai, Pathupattu, key poets
/epics               → Five Great Epics
/bhakti              → Bhakti age — Nayanmars, Alvars (stub — needs expansion)
/medieval            → Medieval period — Chola empire, Kambar (stub)
/kurals              → Thirukkural browser with interactive kural rotator
/explore             → Tamil alphabet, facts, vocabulary, timeline
/works               → Index of all literary works (filterable)
/works/tolkappiyam   → Full study of Tolkappiyam
/works/purananuru    → Full study of Purananuru
/works/thirukkural   → Full study of Thirukkural
/works/silappadikaram → Full study of Silappadikaram
/poets               → Index of all poets (filterable by era)
/poets/tolkappiyar   → Full poet profile
/poets/kapilar       → Full poet profile
/poets/avvaiyar-sangam → Full poet profile
/poets/kaniyan-pungundranar → Full poet profile
/poets/thiruvalluvar → Full poet profile
/poets/ilango-adigal → Full poet profile
/poets/manikkavacakar → Full poet profile
/poets/nammalvar     → Full poet profile
/poets/andal         → Full poet profile
/poets/kambar        → Full poet profile
/404                 → Custom 404 page

---

## SOURCE FILE MAP

src/
├── data/
│   ├── periods.js      — 5 literary periods with context
│   ├── poets.js        — 10 poet profiles with full data
│   └── works.js        — 4 works with full scholarly content
├── layouts/
│   └── Layout.astro    — Base HTML, nav, footer, custom cursor, JS
├── pages/
│   ├── index.astro     — Homepage
│   ├── history.astro   — Full history (6 periods)
│   ├── sangam.astro    — Sangam deep dive
│   ├── epics.astro     — Five epics
│   ├── kurals.astro    — Thirukkural browser
│   ├── explore.astro   — Interactive explore page
│   ├── 404.astro       — Not found page
│   ├── poets/
│   │   ├── index.astro — Poets index with filter
│   │   └── [slug].astro — Dynamic individual poet pages
│   └── works/
│       ├── index.astro — Works index with filter
│       └── [slug].astro — Dynamic individual work pages
└── public/
    ├── styles/
    │   ├── global.css        — Design system
    │   └── interactions.css  — Animations, scroll reveal, cursor
    └── scripts/
        └── main.js           — IntersectionObserver, counters, nav

---

## DESIGN SYSTEM

Colors:
  --crimson:      #8B1A1A    (deep red — primary accent)
  --crimson-light:#C4443A
  --gold:         #C9983A    (burnished gold — headings, Tamil text)
  --gold-light:   #E8C06A
  --ink:          #0F0A06    (near-black background)
  --ink-mid:      #2A1F15    (alternate section background)
  --parchment:    #F7F0E4    (body text on dark)
  --parchment-dark:#EDE3CF

Fonts (Google Fonts — loaded in Layout.astro):
  Cormorant Garamond — Display/headings (the classical serif)
  Crimson Pro        — Body text (readable, elegant)
  Noto Sans Tamil    — All Tamil script

---

## DATA ARCHITECTURE

All content lives in /src/data/ as plain JavaScript objects.
To add a new poet — add an object to poets.js.
To add a new work — add an object to works.js.
The dynamic pages ([slug].astro) automatically generate one page per object.

Poet object shape:
{
  slug: string,           // URL: /poets/[slug]
  name: string,           // English name
  tamil: string,          // Tamil script name
  period: string,         // 'sangam' | 'post-sangam' | 'bhakti' | 'medieval'
  era_label: string,      // Display label
  dates: string,          // Period dates (approximate)
  religion: string,       // Religious background
  region: string,         // Geographic location
  known_for: string,      // One-line summary of major work
  icon: string,           // Unicode symbol for card display
  accent: string,         // Hex color for this poet's accent
  identity: string,       // 2-3 paragraph biographical study
  historical_context: string,  // Political world they lived in
  signature_style: string,     // How they wrote
  ethical_philosophical: string, // What they believed
  key_poems: [            // Array of poem objects
    {
      source: string,     // Anthology + number
      grade: string,      // TN syllabus grade reference
      tamil: string,      // Tamil original text
      translation: string, // English translation
      commentary: string, // Scholarly commentary
      political_note: string // Political/historical significance
    }
  ],
  legacy: string,         // How they influenced later literature
  works: string[],        // Array of work slugs (links to /works/)
  project_madurai: string, // Direct URL to full text
  tamilvu: string         // Direct URL to academic course
}

Work object shape:
{
  slug: string,           // URL: /works/[slug]
  title: string,
  tamil: string,
  author: string,
  author_slug: string,    // Links to /poets/[slug]
  period: string,
  era_label: string,
  dates: string,
  form: string,           // Literary form (anthology, epic, grammar, etc.)
  metre: string,          // Metrical form used
  verses: string,
  language: string,
  religion_context: string,
  overview: string,       // 2-3 paragraph overview
  political_context: string,
  structure: {
    overview: string,
    books: [
      {
        name: string,
        meaning: string,
        sutras: number,    // (for Tolkappiyam)
        chapters: number|string,
        content: string,
        key_sutra: {       // optional
          text: string,
          translation: string,
          note: string
        }
      }
    ]
  },
  tinai_system: {          // (for Tolkappiyam only)
    overview: string,
    tinais: [
      {
        name, region, season, time, flower, tree, bird, animal, deity,
        theme, note
      }
    ]
  },
  what_it_says: string,    // The central arguments of the text
  key_poems: [...],        // Same shape as poet key_poems
  greek_latin_compare: string,  // World literature comparison
  school_syllabus: [
    { grade: string, content: string }
  ],
  project_madurai: string,
  tamilvu: string
}

---

## WHAT NEEDS TO BE ADDED (Next Phase)

Works to build next (add to works.js):
- kurunthokai     (Sangam anthology)
- natrinai        (Sangam anthology)
- akananuru       (Sangam anthology)
- kurinjipattu    (Kapilar's mountain poem)
- pattinapalai    (Port city of Puhar)
- manimekalai     (Buddhist epic)
- civaka-cintamani (Jain epic)
- naladiyar       (Jain minor classic)
- tevaram         (Three Nayanmars)
- thiruvasagam    (Manikkavacakar)
- thiruvaymoli    (Nammalvar)
- thirupavai      (Andal)
- kambaramayanam  (Kambar)
- periyapuranam   (Sekkizhar)

Poets to add next (add to poets.js):
- nakkirar        (Sangam — Thirumurugatrupadai)
- sithalai-sattanar (Post-Sangam — Manimekalai)
- tiruttakkatevar (Post-Sangam — Civaka Cintamani)
- thirugnanasambandar (Bhakti — Tevaram)
- appar           (Bhakti — Tevaram)
- sundarar        (Bhakti — Tevaram)
- periyalvar      (Bhakti — Thirupallandu)
- sekkizhar       (Medieval — Periyapuranam)
- avvaiyar-medieval (Medieval — Aathichudi)

Pages to add next:
- /bhakti         (full treatment — currently stub)
- /medieval       (full treatment — currently stub)
- /compare        (Tamil vs Greek/Latin/Sanskrit)
- /archaeology    (literary-archaeological overlap)
- /minor-classics (Pathinenkilkanakku)

---

## THE AI PROMPT (for Antigravity's AI builder or any AI tool)

If Antigravity has an AI page builder, use this exact prompt:

=== BEGIN PROMPT ===

You are building a page for a bilingual (Tamil + English) academic website
about Tamil literary history. The site's design system uses:

Background: #0F0A06 (near black)
Primary text: #F7F0E4 (warm parchment)
Gold accent: #C9983A
Crimson accent: #8B1A1A
Fonts: Cormorant Garamond (display), Crimson Pro (body), Noto Sans Tamil (Tamil script)

Design principles:
- Dark background, parchment text — like a manuscript
- Generous white space
- Tamil text in Noto Sans Tamil, always gold colored
- English headings in Cormorant Garamond, large and elegant
- Body text in Crimson Pro at 1.05-1.15rem, line-height 1.85-1.9
- Sections separated by thin gold lines (rgba(201,152,58,0.15))
- Cards use 1px borders in rgba(201,152,58,0.1) with hover effects
- Political and critical callout boxes: dark red background, left border
- Sticky tab navigation on long pages for section jumping
- Scroll reveal animations on all cards and sections

Content approach:
- Post-doctoral scholarly tone — no simplification, no sugar-coating
- Every historical claim anchored to a poem, inscription, or MuVa reference
- Political context is mandatory for every period and every work
- Greek/Latin/Sanskrit comparison treated as equals, not superiors
- The Kalabhra period (300-600 CE) covered directly and honestly
- Caste, religion, and power dynamics named explicitly
- Women's voices and roles given equal weight throughout

Content sources:
- Primary: Mu. Varadarajan's Tamil Ilakkiya Varalaru
- Secondary: Project Madurai (projectmadurai.org) for full texts
- Academic: Tamil Virtual University (tamilvu.org) for commentary
- Curriculum: TN state board Tamil textbooks Std. 6-12 for syllabus poems

Every poem displayed must show:
1. Tamil original (Noto Sans Tamil font, gold color, pre-line whitespace)
2. English translation (Cormorant Garamond, italic)
3. Scholarly commentary (Crimson Pro, body text)
4. Political/historical note in a callout box (crimson tinted background)
5. TN syllabus grade reference

=== END PROMPT ===

---

## CONTENT EXPANSION PROMPT

When adding new poets or works, give this prompt to any AI:

=== BEGIN CONTENT PROMPT ===

You are a post-doctoral researcher specializing in Tamil literature,
political history, and archaeology. Write a complete profile for the
Tamil [poet/work]: [NAME].

Follow this exact structure:

FOR A POET:
1. Identity (2-3 paragraphs) — biographical facts vs legend, what we
   actually know vs what tradition says, their social position, caste
   background, religious affiliation, and what their name means.

2. Historical & Political Context (2-3 paragraphs) — which dynasty ruled
   when they lived, what the political situation was, how that shaped
   their writing, trade routes and material conditions if relevant.

3. Signature Style — their metre, their imagery, what makes them
   technically distinctive from other poets of their period.

4. Ethics & Philosophy — not what religion they belonged to, but what
   their actual writing argues about how to live, about power, about
   death, about social order.

5. 2-3 Key Poems:
   - Tamil original text
   - Literal English translation (not a paraphrase)
   - Line-by-line commentary (what each image actually means)
   - Political note (how this poem functions as a historical document)
   - TN school syllabus grade reference if applicable

6. Legacy — how they influenced later literature, how they are used in
   modern Tamil political and cultural discourse.

Do NOT soften political content. The Kalabhra erasure, caste violence,
religious conflict, and gender restrictions should be named directly.
Do NOT project Hindu nationalist readings onto texts that predate or
contradict them (especially Thirukkural, Sangam poetry).
DO compare to Greek, Latin, and Sanskrit literature of the same period.
DO note when TN school textbooks exclude or minimize a poem or period.

Format the output as a JavaScript object matching this shape:
[paste the poet object shape from this document]

=== END CONTENT PROMPT ===

---

## EXTERNAL LINKS POLICY

Every work and poet page must link to:
1. Project Madurai — direct link to that specific text's page
   Root: https://www.projectmadurai.org/pm_etexts/utf8/
   Example: https://www.projectmadurai.org/pm_etexts/utf8/pmuni0025.html

2. Tamil Virtual University — direct link to course/lesson
   Root: https://www.tamilvu.org/courses/
   Example: https://www.tamilvu.org/courses/degree/p101/p1014/html/p1014ind.htm

All external links: target="_blank" rel="noopener noreferrer"

---

## WHAT THIS SITE IS (for any builder who needs context)

This is NOT:
- A tourist information site about Tamil Nadu
- A devotional site about Tamil Hinduism
- A simple poetry anthology
- A "culture appreciation" site

This IS:
- A scholarly resource treating Tamil literature the way Oxford or
  Chicago treats Greek and Latin literature
- A political history of a civilization told through its literature
- A resource for students from Std. 6 through PG level
- A counterargument to the marginalization of Tamil in world literary
  history — made through evidence, not assertion

The site argues one thesis throughout: Tamil literature is not a
regional footnote to Sanskrit literature or to world literary history.
It is one of the major literary civilizations of the ancient world,
with its own grammar theory, its own aesthetic system, its own
political philosophy, and an unbroken living tradition that no other
classical language can match.

That argument is made through primary sources, historical context,
and honest political analysis — not through nationalism or sentiment.

---

Document version: v2
Site: Tamil Ilakkiya Varalaru — தமிழ் இலக்கிய வரலாறு
Built with: Astro 4.x, static output, no server required
Total pages: 24 (expandable to 60+ with full data)
