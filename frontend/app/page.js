"use client"

import { useState } from "react"
import Header from "../components/Header/Header"
import CandlestickChart from "../components/Charts/CandlestickChart"

export default function Dashboard() {
    const [chartData, setChartData] = useState([])
    const [interval, setInterval] = useState("5m")

    return (
        <div className="min-h-screen bg-[#06080C] text-slate-300 font-sans antialiased selection:bg-blue-500/30 flex flex-col">

            {/* Top Navigation - Glassmorphism effect */}
            <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#06080C]/80 backdrop-blur-xl">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 flex items-center h-16 w-full">
                    <div className="w-full">
                        <Header
                        setChartData={setChartData}
                        interval={interval}
                        setInterval={setInterval}
                        />
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">

                {/* Page Title & Status Indicator */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-white">Market Overview</h1>
                        <p className="text-sm text-slate-500 mt-1">Real-time market activity and price action.</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Operational
                    </div>
                </div>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Chart Widget Container - Taking up 2 columns for a nice rectangle, fixed height */}
                    <div className="relative group col-span-1 lg:col-span-2 h-[450px] bg-[#0D1117] rounded-xl border border-white/[0.06] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 hover:border-white/[0.1]">
                        
                        {/* Subtle top gradient highlight */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

                        {/* Chart Toolbar (UI Framing) */}
                        <div className="h-14 shrink-0 border-b border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent flex items-center px-6 justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-semibold text-white tracking-wide">Primary Chart</h2>
                                <div className="h-4 w-px bg-white/[0.1]"></div>
                                <span className="text-xs font-medium text-slate-400">Advanced Mode</span>
                            </div>
                            
                            <div className="flex bg-black/20 rounded-lg p-1 border border-white/[0.03]">
                                {['5m','15m','1h','1d'].map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setInterval(time)}
                                    className={`text-xs px-3 py-1 rounded-md ${
                                    interval === time ? "bg-white/10 text-white": "text-slate-400"}`}>
                                    {time}
                                </button>
                                 ))}
        
                            </div>
                        </div>

                        {/* Actual Chart Component Area - Now properly filling the remaining space */}
                        <div className="flex-1 w-full p-4 relative min-h-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.01] to-transparent pointer-events-none"></div>
                            
                            {/* Chart Wrapper - completely fills the parent flex child */}
                            <div className="w-full h-full relative z-10">
                                <CandlestickChart chartData={chartData} maLength={10}/>
                            </div>
                        </div>
                    </div>

                    {/* Example of another bento box to complete the grid */}
                    <div className="relative h-[450px] bg-[#0D1117] rounded-xl border border-white/[0.06] shadow-2xl p-6">
                        <h2 className="text-sm font-semibold text-white tracking-wide">Market Stats</h2>
                        {/* More bento content here */}
                    </div>

                </div>
            </main>
        </div>
    )
}