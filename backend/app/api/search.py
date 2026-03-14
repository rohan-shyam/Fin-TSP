from fastapi import APIRouter
import json 
with open("app/data/nse_tickers.json") as f:
    stocks = json.load(f)

router = APIRouter()

@router.get("/search")
def search(q: str):
    q = q.lower()

    results = [
        s for s in stocks
        if q in s["symbol"].lower() or q in s["name"].lower()
    ]

    return results[:10]