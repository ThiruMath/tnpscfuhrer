import json
import os
import random
from datetime import datetime

def load_json(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []

def generate_revision():
    # Load sources
    news = load_json("public/data/news.json")
    pyq = load_json("public/data/pyq.json")

    questions = []

    # 1. Generate 2 Concept Questions from latest news topics
    topics = list(set([item.get('topic') for item in news if item.get('topic') != 'Others']))
    if topics:
        selected_topics = random.sample(topics, min(2, len(topics)))
        for topic in selected_topics:
            questions.append({
                "question": f"Explain the core concepts of {topic} as it relates to current events.",
                "topic": topic,
                "source": "concept"
            })

    # 2. Pick 2 Smarter News Questions based on keyword rules
    news_items = news[:10]  # Focus only on top 10 recent
    selected_news = random.sample(news_items, min(2, len(news_items)))
    for item in selected_news:
        title = item['title'].lower()
        question_text = f"Based on recent news regarding '{item['title']}', what are the key implications?"
        
        # Simple rule-based intelligence
        if "rbi" in title or "repo" in title:
            question_text = "What is the role of the RBI in monetary policy and controlling inflation?"
        elif "supreme court" in title or "cji" in title:
            question_text = "What is the constitutional role and jurisdiction of the Supreme Court of India?"
        elif "isro" in title or "satellite" in title:
            question_text = "What are the recent achievements and primary objectives of ISRO?"
        
        questions.append({
            "question": question_text,
            "topic": item["topic"],
            "source": "news",
            "reference": item["link"]
        })

    # 3. Pick 1 PYQ, prioritizing recent years matching current topics
    if pyq and topics:
        # Sort pyq descending by year
        try:
            recent_pyq = sorted(pyq, key=lambda x: int(x.get("year", 0)), reverse=True)
        except:
            recent_pyq = pyq 
            
        # Try to find a recent PYQ that matches a current news topic
        matched_q = next((q for q in recent_pyq if q.get("topic") in topics), None)
        
        if not matched_q:
            matched_q = random.choice(recent_pyq)
            
        questions.append({
            "question": f"({matched_q['year']}) {matched_q['question']}",
            "topic": matched_q["topic"],
            "source": "pyq"
        })

    # Output Structure
    today_str = datetime.now().strftime("%Y-%m-%d")
    output = {
        "date": today_str,
        "questions": questions
    }
    
    # Save the latest revision
    os.makedirs("public/data", exist_ok=True)
    with open("public/data/revision.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        
    # Save History representation
    os.makedirs("public/data/revision-history", exist_ok=True)
    with open(f"public/data/revision-history/{today_str}.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        
    print(f"Generated {len(questions)} revision questions to public/data/revision.json and saved to history.")

if __name__ == "__main__":
    generate_revision()
