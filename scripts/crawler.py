import feedparser
import json
import os
from bs4 import BeautifulSoup

sources = {
    "hindu": "https://www.thehindu.com/news/national/feeder/default.rss",
    "bbc": "https://feeds.bbci.co.uk/news/rss.xml",
    "google": "https://news.google.com/rss"
}

def clean_html(html_content):
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text(strip=True)

def load_syllabus():
    try:
        with open("public/data/syllabus.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: could not load syllabus.json ({e})")
        return {}

def load_pyq():
    try:
        with open("public/data/pyq.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: could not load pyq.json ({e})")
        return []

def load_topic_notes():
    try:
        with open("public/data/topic_notes.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: could not load topic_notes.json ({e})")
        return {}

def detect_topic(text, syllabus):
    text = text.lower()
    for topic, keywords in syllabus.items():
        for keyword in keywords:
            if keyword.lower() in text:
                return topic
    return "Others"

def crawl_news():
    articles = []
    syllabus = load_syllabus()
    pyq_list = load_pyq()
    notes_map = load_topic_notes()
    
    for source, url in sources.items():
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:10]:
                title = entry.get("title", "")
                summary = clean_html(entry.get("summary", ""))
                combined_text = title + " " + summary
                topic = detect_topic(combined_text, syllabus)
                
                import re
                slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

                attached_pyq = [q for q in pyq_list if q.get("topic") == topic]
                attached_notes = notes_map.get(topic, [])
                
                articles.append({
                    "title": title,
                    "slug": slug,
                    "topic": topic,
                    "summary": summary,
                    "link": entry.get("link", ""),
                    "source": source,
                    "date": entry.get("published", ""),
                    "pyq": attached_pyq,
                    "notes": attached_notes
                })
        except Exception as e:
            print(f"Failed to fetch {source}: {e}")
            
    os.makedirs("public/data", exist_ok=True)
    with open("public/data/news.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully scraped {len(articles)} articles and saved to public/data/news.json")

if __name__ == "__main__":
    crawl_news()
