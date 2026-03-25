from fastapi import APIRouter, HTTPException
import yfinance as yf

router = APIRouter()

@router.get("/stock/info")
def get_stock_info(symbol: str):
    try:
        if "." not in symbol:
            symbol = symbol + ".NS"

        ticker = yf.Ticker(symbol)
        fast = ticker.fast_info
        info = ticker.info

        price = fast.last_price or fast.previous_close
        prev_close = fast.previous_close
        change_pct = ((price - prev_close) / prev_close) * 100 if price and prev_close else None

        return {
            "symbol":         symbol,
            "name":           info.get("longName") or info.get("shortName") or symbol,
            "exchange":       fast.exchange,
            "sector":         info.get("sector") or "—",
            "price":          price,
            "change_pct":     change_pct,
            "market_cap":     fast.market_cap,
            "volume":         fast.three_month_average_volume,
            "week_52_high":   fast.year_high,
            "week_52_low":    fast.year_low,
            "pe_ratio":       info.get("trailingPE"),
            "eps":            info.get("trailingEps"),
            "dividend_yield": info.get("dividendYield"),
            "beta":           info.get("beta"),
            "signal":         None,
            "confidence":     None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
