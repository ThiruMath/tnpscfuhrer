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

table = soup.find("table")

rows = table.find_all("tr")[1:]  # skip header

for row in rows:
    cols = row.find_all("td")

    if len(cols) >= 6:
        notification_no = cols[1].text.strip()
        post_name = cols[2].text.strip()
        apply_from = cols[3].text.strip()
        apply_to = cols[4].text.strip()
        exam_date = cols[5].text.strip()

        link_tag = cols[2].find("a")
        link = ""

        if link_tag:
            link = link_tag.get("href")

            if not link.startswith("http"):
                link = "https://www.tnpsc.gov.in/" + link

        jobs.append({
            "notification_no": notification_no,
            "post_name": post_name,
            "apply_from": apply_from,
            "apply_to": apply_to,
            "exam_date": exam_date,
            "link": link
        })

with open("src/data/jobs.json", "w", encoding="utf-8") as f:
    json.dump(jobs, f, indent=2, ensure_ascii=False)

print("Collected jobs:", len(jobs))