import requests
from bs4 import BeautifulSoup
import json

URL = "https://www.tnpsc.gov.in/english/notification.aspx"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(URL, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

jobs = []

# Find all links on the page
for link in soup.find_all("a", href=True):
    text = link.get_text(strip=True)

    if "notification" in text.lower() or "examination" in text.lower():
        href = link["href"]

        if not href.startswith("http"):
            href = "https://www.tnpsc.gov.in/" + href.lstrip("/")

        jobs.append({
            "title": text,
            "link": href
        })

# Remove duplicates
unique_jobs = {job["title"]: job for job in jobs}.values()

with open("src/data/jobs.json", "w", encoding="utf-8") as f:
    json.dump(list(unique_jobs), f, indent=2)

print("Jobs collected:", len(unique_jobs))