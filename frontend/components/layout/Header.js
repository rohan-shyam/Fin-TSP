"use client"

import { useState } from "react"

export default function Header({setChartData}) {

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [open, setOpen] = useState(false)
    

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
        setResults([])
        setOpen(false)

        const res = await fetch(`http://localhost:8000/ohlc?symbol=${symbol}`)
        const data = await res.json()
        setChartData(data)
        
    }

    return (
        <div className="relative flex flex-col mt-20 mx-auto max-w-xl">

            <input
            type="text"
            autoComplete="off"
            value={query}
            onChange={handleSearch}
            placeholder="Search.."
            className="bg-white text-black border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 z-20"
            />

            {open && results.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded shadow z-10">
                    
                    {results.map((stock) => (
                        <div
                            key={stock.symbol}
                            className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => selectStock(stock.symbol)}
                        >
                            {stock.symbol} — {stock.name}
                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}