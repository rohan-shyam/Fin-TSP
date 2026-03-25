"use client"

import { useState } from "react"
import Header from "../components/Header/Header"
import CandlestickChart from "../components/Charts/CandlestickChart"
import StockDetails from "../components/Charts/StockDetails"

export default function Dashboard() {
    const [chartData, setChartData] = useState([])
    const [interval, setInterval] = useState("5m")
    const [selectedSymbol, setSelectedSymbol] = useState(null)

    return (
        <div className="min-h-screen bg-[#06080C] text-slate-300 font-sans antialiased selection:bg-blue-500/30 flex flex-col">

            <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#06080C]/80 backdrop-blur-xl">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 flex items-center h-16 w-full">
                    <div className="w-full">
                        <Header
                            setChartData={setChartData}
                            interval={interval}
                            setInterval={setInterval}
                            onSymbolChange={setSelectedSymbol}
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto px-4 sm:p-2 lg:p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="relative group col-span-1 md:col-span-2 lg:col-span-2
                                    min-h-[320px] h-[calc(100vh-12rem)] max-h-[700px]
                                    rounded bg-[#0D1117] border border-white/[0.06] shadow-2xl
                                    flex flex-col overflow-hidden
                                    transition-all duration-300 hover:border-white/[0.1]">

                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

                        <div className="h-14 shrink-0 border-b border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent flex items-center px-6 justify-between">
                            <h2 className="text-sm font-semibold text-white tracking-wide">
                                {selectedSymbol ?? "Primary Chart"}
                            </h2>
                            <div className="flex bg-black/20 rounded-lg p-1 border border-white/[0.03]">
                                {['5m', '15m', '1h', '1d'].map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setInterval(time)}
                                        className={`text-xs px-3 py-1 rounded-md transition-colors ${
                                            interval === time ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
                                        }`}>
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full p-4 relative min-h-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.01] to-transparent pointer-events-none" />
                            <div className="w-full h-full relative z-10">
                                <CandlestickChart chartData={chartData} maLength={10} />
                            </div>
                        </div>
                    </div>

                    <div className="relative col-span-1 md:col-span-2 lg:col-span-1
                                    min-h-[240px] lg:h-[calc(100vh-12rem)] lg:max-h-[700px]
                                    bg-[#0D1117] border rounded border-white/[0.06] shadow-2xl
                                    flex flex-col overflow-hidden">
                        <StockDetails symbol={selectedSymbol} />
                    </div>

                    <div className="relative col-span-1 md:col-span-2 lg:col-span-3
                                    min-h-[400px]
                                    bg-[#0D1117] border rounded border-white/[0.06] shadow-2xl p-6">
                    </div>

                </div>
            </main>
        </div>
    )
}
