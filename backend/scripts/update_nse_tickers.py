import requests
from bs4 import BeautifulSoup
import json
import time

BASE_URL = "https://www.screener.in/screens/357649/all-listed-companies/?page={}"

headers = {
    "User-Agent": "Mozilla/5.0"
}

companies = []
seen = set()
page = 1

while True:

    print("Scraping page", page)

    url = BASE_URL.format(page)
    r = requests.get(url, headers=headers)

    soup = BeautifulSoup(r.text, "html.parser")

    table = soup.find("table", {"class": "data-table"})

    if not table:
        break

    rows = table.find_all("tr")[1:]

    new_found = False

    for row in rows:

        link = row.find("a")

        if not link:
            continue

        href = link.get("href", "")

        if not href.startswith("/company/"):
            continue

        parts = href.split("/")

        if len(parts) < 3:
            continue

        symbol = parts[2]
        name = link.text.strip()

        if symbol in seen:
            continue

        seen.add(symbol)
        new_found = True

        companies.append({
            "symbol": symbol,
            "name": name
        })
        
    if not new_found:
        break

    page += 1
    time.sleep(1)

print("Collected", len(companies), "companies")

with open("app/data/nse_tickers.json", "w") as f:
    json.dump(companies, f, indent=2)