"use client"

import { useState } from "react"
import SearchDropdown from "./SearchDropdown"
import { searchStocks } from "@/lib/api"

export default function SearchBox({ onSelectSymbol }) {

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [open, setOpen] = useState(false)

    async function handleSearch(e) {

        const value = e.target.value
        setQuery(value)

        if (value.length < 2) {
            setResults([])
            setOpen(false)
            return
        }

        try {
            const data = await searchStocks(value)
            setResults(data)
            setOpen(data.length > 0)
        } catch (err) {
            console.error("Search failed", err)
        }
    }

    function selectStock(symbol) {
        setQuery(symbol)
        setResults([])
        setOpen(false)
        onSelectSymbol(symbol)
    }

    return (
        <div className="relative w-full max-w-lg">

            <input
                type="text"
                autoComplete="off"
                value={query}
                onChange={handleSearch}
                placeholder="Search NSE stocks..."
                className="w-full bg-[#0D1117] text-slate-200 border border-white/[0.08] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500"
            />

            <SearchDropdown
                open={open}
                results={results}
                onSelect={selectStock}
            />

        </div>
    )
}