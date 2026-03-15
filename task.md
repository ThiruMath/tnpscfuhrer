# 📄 task.md — MVP Implementation Roadmap

## Project

TNPSC / UPSC Current Affairs Engine (MVP)

Goal:

```text
Automated Current Affairs System
→ Fetch news
→ Tag syllabus topics
→ Link notes
→ Link PYQ
→ Show on Astro pages
```

Timeline:

```text
10–14 days
```

---

# Phase 1 — Project Setup (Day 1)

## Task 1.1 Create scripts directory

Create:

```text
/scripts
```

Files:

```text
crawler.py
```

---

## Task 1.2 Create data directory

Create:

```text
/public/data
```

Files:

```text
news.json
syllabus.json
pyq.json
```

---

## Task 1.3 Create requirements file

```text
requirements.txt
```

Add:

```text
feedparser
beautifulsoup4
```

---

# Phase 2 — RSS News Crawler (Day 2–3)

Goal:

```text
Fetch latest news articles automatically
```

Sources:

* The Hindu
* Press Information Bureau
* BBC

Tasks:

### Task 2.1 Install library

```bash
pip install feedparser
```

---

### Task 2.2 Build crawler

`scripts/crawler.py`

Output:

```text
/public/data/news.json
```

Fields:

```json
title
summary
link
source
date
```

---

### Task 2.3 Limit results

Fetch:

```text
10–20 latest news items
```

---

# Phase 3 — Topic Tagging (Day 4)

Goal:

```text
Map news to syllabus topics
```

Create file:

```text
/public/data/syllabus.json
```

Example:

```json
{
 "Economy": ["inflation","rbi","bank"],
 "Polity": ["parliament","supreme court","constitution"],
 "Environment": ["climate","cop","biodiversity"],
 "International Relations": ["china","usa","middle east"]
}
```

---

### Task 3.1 Build topic matcher

Add function:

```python
def detect_topic(text)
```

Logic:

```text
keyword matching
```

Example:

```text
"inflation" → Economy
"parliament" → Polity
```

---

# Phase 4 — PYQ Integration (Day 5)

Create file:

```text
/public/data/pyq.json
```

Example:

```json
[
 {
  "topic":"Economy",
  "year":"UPSC 2022",
  "question":"Explain the role of RBI in controlling inflation."
 }
]
```

Crawler attaches relevant PYQ.

Output example:

```json
{
 "title":"RBI keeps repo rate unchanged",
 "topic":"Economy",
 "pyq":[...]
}
```

---

# Phase 5 — Notes Linking (Day 6)

Goal:

```text
Connect news topics with existing notes
```

Mapping file:

```text
/public/data/topic_notes.json
```

Example:

```json
{
 "Economy":"monetary-policy",
 "Polity":"parliament",
 "Environment":"climate-change"
}
```

Output:

```text
/news → related notes
```

---

# Phase 6 — Astro Current Affairs Page (Day 7–8)

Create pages:

```text
/src/pages/current-affairs/index.astro
/src/pages/current-affairs/[slug].astro
```

---

### Task 6.1 List news

Load:

```text
/public/data/news.json
```

Display:

```text
Title
Summary
Topic tag
```

---

### Task 6.2 Article page

Display:

```text
Title
Summary
Source
Topic
Related Notes
PYQ
```

---

# Phase 7 — GitHub Automation (Day 9)

Create workflow:

```text
.github/workflows/news.yml
```

Schedule:

```text
Every 12 hours
```

Steps:

```text
Install Python
Run crawler
Commit news.json
Push changes
```

Automation tool:

GitHub Actions

---

# Phase 8 — Testing (Day 10)

Test:

```text
Crawler runs
JSON generated
Astro page renders
Links work
```

Verify:

```text
notes link
pyq link
topic tag
```

---

# Phase 9 — Deployment (Day 11)

Push to:

```text
GitHub
```

Automatic build on:

Cloudflare Pages

Verify:

```text
site updates automatically
```

---

# MVP Feature Checklist

Working system should include:

```text
✔ automated news crawler
✔ syllabus topic tagging
✔ PYQ integration
✔ notes linking
✔ Astro current affairs page
✔ GitHub automation
```
