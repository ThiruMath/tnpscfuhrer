import requests
from bs4 import BeautifulSoup
import json

url = "https://www.tnpsc.gov.in/notifications"

response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

jobs = []

for link in soup.find_all("a"):
    title = link.text.strip()

    if "notification" in title.lower():
        jobs.append({
            "title": title,
            "link": link.get("href")
        })

with open("src/data/jobs.json", "w") as f:
    json.dump(jobs, f, indent=2)

print("Jobs updated")