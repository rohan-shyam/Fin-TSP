"use client"

import { useState, useEffect } from "react"
import SearchBox from "./SearchBox"
import { fetchOHLC } from "@/lib/api"

export default function Header({ setChartData, interval, onSymbolChange }) {
    const [symbol, setSymbol] = useState(null)

    const handleSymbolSelect = (sym) => {
        setSymbol(sym)
        if (onSymbolChange) onSymbolChange(sym)
    }

    useEffect(() => {
        if (!symbol) return
        async function loadData() {
            try {
                const data = await fetchOHLC(symbol, interval)
                setChartData(data)
            } catch (err) {
                console.error("Failed to load OHLC", err)
            }
        }
        loadData()
    }, [symbol, interval, setChartData])

    return (
        // Changed to justify-center here
        <div className="w-full flex justify-center"> 
            <SearchBox onSelectSymbol={handleSymbolSelect} />
        </div>
    )
}