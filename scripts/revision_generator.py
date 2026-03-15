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

    # 2. Pick 2 News Questions
    news_items = random.sample(news, min(2, len(news)))
    for item in news_items:
        questions.append({
            "question": f"Based on recent news regarding '{item['title']}', what are the key implications?",
            "topic": item["topic"],
            "source": "news",
            "reference": item["link"]
        })

    # 3. Pick 1 PYQ
    if pyq:
        q = random.choice(pyq)
        questions.append({
            "question": f"({q['year']}) {q['question']}",
            "topic": q["topic"],
            "source": "pyq"
        })

    # Output
    output = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "questions": questions
    }
    
    os.makedirs("public/data", exist_ok=True)
    with open("public/data/revision.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        
    print(f"Generated {len(questions)} revision questions to public/data/revision.json")

if __name__ == "__main__":
    generate_revision()
