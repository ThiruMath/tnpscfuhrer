import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}

def scrape_tnpsc():
    jobs = []
    try:
        url = "https://www.tnpsc.gov.in/notifications.html"
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")

        rows = soup.select("table tr")
        for row in rows[1:]:
            cols = row.find_all("td")
            if len(cols) >= 3:
                title = cols[0].get_text(strip=True)
                deadline = cols[1].get_text(strip=True) if len(cols) > 1 else "Check Portal"
                link_tag = cols[0].find("a")
                link = link_tag["href"] if link_tag and link_tag.get("href") else "https://www.tnpsc.gov.in"
                if not link.startswith("http"):
                    link = "https://www.tnpsc.gov.in/" + link.lstrip("/")

                if title:
                    jobs.append({
                        "title": title,
                        "dept": "Tamil Nadu PSC",
                        "type": "State",
                        "posts": "Various",
                        "deadline": deadline,
                        "status": "Open",
                        "link": link,
                        "source": "tnpsc.gov.in"
                    })
    except Exception as e:
        print(f"TNPSC scrape error: {e}")

    return jobs


def scrape_tnusrb():
    jobs = []
    try:
        url = "https://www.tnusrbonline.org/"
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")

        for a in soup.select("a"):
            text = a.get_text(strip=True)
            href = a.get("href", "")
            if text and len(text) > 15 and any(k in text.lower() for k in ["constable", "police", "recruit", "notification"]):
                if not href.startswith("http"):
                    href = "https://www.tnusrbonline.org/" + href.lstrip("/")
                jobs.append({
                    "title": text[:120],
                    "dept": "TNUSRB",
                    "type": "State",
                    "posts": "Various",
                    "deadline": "Check Portal",
                    "status": "Open",
                    "link": href or "https://www.tnusrbonline.org",
                    "source": "tnusrbonline.org"
                })
                if len(jobs) >= 5:
                    break
    except Exception as e:
        print(f"TNUSRB scrape error: {e}")

    return jobs


def scrape_ssc():
    jobs = []
    try:
        url = "https://ssc.gov.in/portal/latestNews"
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")

        for item in soup.select("li, .news-item, .notification-item"):
            text = item.get_text(strip=True)
            link_tag = item.find("a")
            href = link_tag["href"] if link_tag and link_tag.get("href") else "https://ssc.gov.in"
            if not href.startswith("http"):
                href = "https://ssc.gov.in/" + href.lstrip("/")
            if text and len(text) > 10:
                jobs.append({
                    "title": text[:120],
                    "dept": "Staff Selection Commission",
                    "type": "Central",
                    "posts": "Various",
                    "deadline": "Check SSC Portal",
                    "status": "Open",
                    "link": href,
                    "source": "ssc.gov.in"
                })
                if len(jobs) >= 5:
                    break
    except Exception as e:
        print(f"SSC scrape error: {e}")

    return jobs


def load_existing():
    path = "src/data/jobs.json"
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return []


def merge_jobs(existing, new_jobs):
    existing_titles = {j["title"].lower().strip() for j in existing}
    merged = list(existing)
    for job in new_jobs:
        if job["title"].lower().strip() not in existing_titles:
            job["addedAt"] = datetime.utcnow().strftime("%Y-%m-%d")
            merged.append(job)
            existing_titles.add(job["title"].lower().strip())
    # Keep latest 200 jobs
    return merged[-200:]


def main():
    os.makedirs("src/data", exist_ok=True)

    print("Scraping TNPSC...")
    tnpsc_jobs = scrape_tnpsc()
    print(f"  Found {len(tnpsc_jobs)} jobs")

    print("Scraping TNUSRB...")
    tnusrb_jobs = scrape_tnusrb()
    print(f"  Found {len(tnusrb_jobs)} jobs")

    print("Scraping SSC...")
    ssc_jobs = scrape_ssc()
    print(f"  Found {len(ssc_jobs)} jobs")

    all_new = tnpsc_jobs + tnusrb_jobs + ssc_jobs
    existing = load_existing()
    merged = merge_jobs(existing, all_new)

    output = {
        "lastUpdated": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "jobs": merged
    }

    with open("src/data/jobs.json", "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved {len(merged)} total jobs to src/data/jobs.json")


if __name__ == "__main__":
    main()
