"use client"

import { useState } from "react"
import Header from "../components/layout/Header"
import CandlestickChart from "../components/CandlestickChart"

export default function Dashboard() {
    const [chartData, setChartData] = useState([])

    return (
        <div className="min-h-screen bg-[#06080C] text-slate-300 font-sans antialiased selection:bg-blue-500/30 flex flex-col">

            {/* Top Navigation - Glassmorphism effect */}
            <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#06080C]/80 backdrop-blur-xl">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 flex items-center h-16 w-full">
                    {/* Header wrapper to allow your component to expand naturally */}
                    <div className="w-full">
                        <Header setChartData={setChartData} />
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
                    
                    {/* Pulsing Live Data Indicator */}
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Operational
                    </div>
                </div>

                {/* Chart Widget Container */}
                <div className="relative group flex-1 w-full min-h-[600px] bg-[#0D1117] rounded-xl border border-white/[0.06] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 hover:border-white/[0.1]">
                    
                    {/* Subtle top gradient highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

                    {/* Chart Toolbar (UI Framing) */}
                    <div className="h-14 border-b border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent flex items-center px-6 justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-sm font-semibold text-white tracking-wide">Primary Chart</h2>
                            <div className="h-4 w-px bg-white/[0.1]"></div>
                            <span className="text-xs font-medium text-slate-400">Advanced Mode</span>
                        </div>
                        
                        {/* Mock Timeframes - Common in trading UI */}
                        <div className="flex bg-black/20 rounded-lg p-1 border border-white/[0.03]">
                            {['15m', '1H', '4H', '1D'].map((time) => (
                                <button 
                                    key={time} 
                                    className={`text-xs px-3 py-1 rounded-md transition-all ${
                                        time === '4H' 
                                            ? 'bg-white/10 text-white font-medium shadow-sm' 
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actual Chart Component Area */}
                    <div className="flex-1 w-full h-full p-4 relative">
                        {/* Subtle inner glow for depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.01] to-transparent pointer-events-none"></div>
                        
                        {/* Your Chart Component */}
                        <div className="w-full h-full relative z-10">
                            <CandlestickChart chartData={chartData} />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}