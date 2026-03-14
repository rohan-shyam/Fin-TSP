import yfinance as yf
from fastapi import APIRouter

router = APIRouter()

@router.get("/ohlc")
def ohlc(symbol: str):

    ticker = f"{symbol}.NS"

    df = yf.download(ticker, period="5d", interval="5m")

    if df.empty:
        return []

    df = df.reset_index()

    df.columns = [col[0] if isinstance(col, tuple) else col for col in df.columns]

    df["time"] = df["Datetime"].apply(lambda x: int(x.timestamp()))

    df = df.rename(columns={
        "Open": "open",
        "High": "high",
        "Low": "low",
        "Close": "close"
    })

    df = df.sort_values("time")

    return df[["time","open","high","low","close"]].to_dict(orient="records")