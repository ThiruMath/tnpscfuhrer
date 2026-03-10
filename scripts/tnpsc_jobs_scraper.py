import requests
from bs4 import BeautifulSoup
import json

URL = "https://www.tnpsc.gov.in/english/notification.aspx"

response = requests.get(URL, headers={"User-Agent":"Mozilla/5.0"})
soup = BeautifulSoup(response.text, "html.parser")

table = soup.find("table")

jobs = []

rows = table.find_all("tr")[1:]

for row in rows:

    cols = row.find_all("td")

    if len(cols) >= 6:

        notification_no = cols[1].text.strip()
        post_name = cols[2].text.strip()

        apply_from = cols[3].text.strip()
        apply_to = cols[4].text.strip()

        exam_date = cols[5].text.strip()

        main_link = ""
        addendum = []
        corrigendum = []

        for a in cols[2].find_all("a"):

            text = a.text.strip().upper()
            link = a.get("href")

            if not link.startswith("http"):
                link = "https://www.tnpsc.gov.in/" + link

            if "ADDENDUM" in text:
                addendum.append({"title":text,"link":link})

            elif "CORRIGENDUM" in text:
                corrigendum.append({"title":text,"link":link})

            else:
                main_link = link

        jobs.append({
            "notification_no": notification_no,
            "post_name": post_name,
            "apply_from": apply_from,
            "apply_to": apply_to,
            "exam_date": exam_date,
            "main_link": main_link,
            "addendum": addendum,
            "corrigendum": corrigendum
        })

with open("src/data/jobs.json","w",encoding="utf-8") as f:
    json.dump(jobs,f,indent=2,ensure_ascii=False)

print("Collected:",len(jobs))