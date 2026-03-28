import yfinance as yf
from fastapi import APIRouter
import time

router = APIRouter()

# simple in-memory cache
cache = {}
CACHE_TTL = 60  # seconds

def get_clean_ticker(symbol: str):
    """Smart ticker formatter to prevent double-suffixing."""
    if ".NS" in symbol or ".BO" in symbol:
        return symbol
    if symbol.isdigit():
        return f"{symbol}.BO"
    return f"{symbol}.NS"

@router.get("/ohlc")
def ohlc(symbol: str, interval: str = "5m"):

    cache_key = f"{symbol}_{interval}"

    # return cached data if still valid
    if cache_key in cache:
        data, ts = cache[cache_key]
        if time.time() - ts < CACHE_TTL:
            return data

    # THE FIX: Use the smart formatter instead of hardcoding .NS
    ticker = get_clean_ticker(symbol)

    period_map = {
        "5m": "5d",
        "15m": "1mo",
        "1h": "3mo",
        "1d": "5y",
    }

    df = yf.download(
        ticker,
        period=period_map.get(interval, "5d"),
        interval=interval,
        progress=False
    )

    if df.empty:
        return []

    # flatten dataframe (handles yfinance multi-index changes)
    df = df.reset_index()
    df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]

    # yfinance returns different column names depending on interval
    time_col = "Datetime" if "Datetime" in df.columns else "Date"

    # convert to unix timestamp (required by lightweight-charts)
    # Note: lightweight-charts expects timestamps in seconds
    df["time"] = df[time_col].apply(lambda x: int(x.timestamp()))

    # rename OHLC for lightweight-charts strict formatting
    df = df.rename(
        columns={
            "Open": "open",
            "High": "high",
            "Low": "low",
            "Close": "close",
        }
    )

    # enforce correct ordering for lightweight-charts
    df = df.sort_values("time")

    # remove duplicate timestamps (important for chart library)
    df = df.drop_duplicates(subset=["time"])

    # Drop any rows where price data might be NaN to prevent chart crashes
    df = df.dropna(subset=["open", "high", "low", "close"])

    data = df[["time", "open", "high", "low", "close"]].to_dict(orient="records")

    # store in cache
    cache[cache_key] = (data, time.time())

    return data