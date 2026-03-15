"use client"

import { useState, useEffect } from "react"

export default function Header({setChartData, interval}) {

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [open, setOpen] = useState(false)
    const [symbol, setSymbol] = useState(null)

    useEffect(() => {

    if (!symbol) return

    async function fetchData() {
        const res = await fetch(
            `http://localhost:8000/ohlc?symbol=${symbol}&interval=${interval}`
        )

        const data = await res.json()
        setChartData(data)
    }

    fetchData()
    }, [symbol, interval])

    async function handleSearch(e) {

        const value = e.target.value
        setQuery(value)

        if (value.length < 2){
            setResults([])
            setOpen(false)
            return
        }

        const res = await fetch(`http://localhost:8000/search?q=${value}`)
        const data = await res.json()

        setResults(data)
        setOpen(data.length > 0)
    }
    
    async function selectStock(symbol) {
    setQuery(symbol)
    setSymbol(symbol)
    setResults([])
    setOpen(false)
    }

    return (
        <div className="w-full flex justify-center">

            <div className="relative w-full max-w-lg">

            <input
                type="text"
                autoComplete="off"
                value={query}
                onChange={handleSearch}
                placeholder="Search NSE stocks..."
                className="w-full bg-[#0D1117] text-slate-200 border border-white/[0.08] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500"
            />

            {open && results.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[#0D1117] border border-white/[0.06] rounded-lg shadow-xl z-50">

                {results.map((stock) => (
                    <div
                    key={stock.symbol}
                    className="px-4 py-2 hover:bg-white/[0.05] cursor-pointer text-sm"
                    onClick={() => selectStock(stock.symbol)}
                    >
                    {stock.symbol} — {stock.name}
                    </div>
                ))}

                </div>
            )}

            </div>

        </div>
    )
}