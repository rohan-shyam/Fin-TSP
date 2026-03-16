const API_BASE = "http://localhost:8000"

export async function searchStocks(query) {
    const res = await fetch(`${API_BASE}/search?q=${query}`)
    if (!res.ok) throw new Error("Search request failed")
    return res.json()
}

export async function fetchOHLC(symbol, interval) {
    const res = await fetch(`${API_BASE}/ohlc?symbol=${symbol}&interval=${interval}`)
    if (!res.ok) throw new Error("OHLC request failed")
    return res.json()
}