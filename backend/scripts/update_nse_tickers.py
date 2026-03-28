import requests
from bs4 import BeautifulSoup
import json
import time
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "app", "data")
os.makedirs(DATA_DIR, exist_ok=True)
OUTPUT_FILE = os.path.join(DATA_DIR, "nse_tickers.json")

# Back to your original working URL
BASE_URL = "https://www.screener.in/screens/357649/all-listed-companies/?page={}"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

companies = []
seen = set()
page = 1

print("🚀 Rebuilding Ticker Database...")

while True:
    print(f"📦 Scraping Page {page}...", end="\r")
    url = BASE_URL.format(page)
    
    try:
        r = requests.get(url, headers=headers, timeout=10)
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

            raw_symbol = parts[2]
            name = link.text.strip()

            if raw_symbol in seen:
                continue

            # THE FIX: Apply the correct suffix based on format
            formatted_symbol = f"{raw_symbol}.BO" if raw_symbol.isdigit() else f"{raw_symbol}.NS"

            seen.add(raw_symbol)
            new_found = True

            companies.append({
                "symbol": formatted_symbol,
                "name": name
            })
            
        if not new_found:
            break

    except Exception as e:
        print(f"\n⚠️ Error fetching page {page}: {e}")
        break

    page += 1
    time.sleep(1)

print(f"\n✅ Finished scraping. Found {len(companies)} assets.")

# THE SAFEGUARD: Never overwrite with empty data
if len(companies) > 0:
    with open(OUTPUT_FILE, "w") as f:
        json.dump(companies, f, indent=2)
    print(f"💾 Database restored and saved to: {OUTPUT_FILE}")
else:
    print("❌ Critical Abort: Scraped 0 assets. Your existing file was NOT modified.")