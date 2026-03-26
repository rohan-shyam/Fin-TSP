"use client"

import { useState } from "react"
import Header from "../components/Header/Header"
import CandlestickChart from "../components/Charts/CandlestickChart"
import StockDetails from "../components/Charts/StockDetails"
import STFTExplanation from "@/components/Content/STFTExplanation"
import ProjectScopePanel from "../components/Content/ProjectScopePanel"

// Sidebar Navigation Helper
function NavItem({ icon, label, isActive, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive ? "bg-blue-500/10 text-blue-400" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
            }`}
        >
            <div className={isActive ? "text-blue-400" : "text-slate-500"}>{icon}</div>
            <span className={`text-sm font-medium hidden lg:block ${isActive ? "text-blue-400" : ""}`}>{label}</span>
        </button>
    )
}

export default function Dashboard() {
    const [chartData, setChartData] = useState([])
    const [interval, setInterval] = useState("5m")
    const [selectedSymbol, setSelectedSymbol] = useState(null)
    
    // CHANGED THIS: Now defaults to "overview" when you load the page
    const [activeTab, setActiveTab] = useState("overview")

    return (
        <div className="flex h-screen w-full bg-[#06080C] text-slate-300 font-sans overflow-hidden">
            
            {/* --- SIDEBAR --- */}
            <aside className="w-16 lg:w-64 shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0B0E14] z-20">
                <div className="h-16 flex items-center justify-center lg:justify-start lg:px-5 border-b border-white/[0.06] shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">QT</span>
                    </div>
                    <span className="hidden lg:block ml-3 font-bold text-slate-200">
                        Quant<span className="text-blue-500 font-medium">Terminal</span>
                    </span>
                </div>
                <nav className="flex-1 overflow-y-auto py-5 flex flex-col gap-1.5 px-2 lg:px-3 custom-scrollbar">
                    <NavItem isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Markets Overview" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
                    <NavItem isActive={activeTab === "analysis"} onClick={() => setActiveTab("analysis")} label="STFT Analysis" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} />
                </nav>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 relative h-screen">
                
                {/* TOP NAVIGATION (With Centered Search Bar) */}
                <header className="h-16 shrink-0 flex items-center px-6 border-b border-white/[0.06] bg-[#06080C]/80 backdrop-blur-md sticky top-0 z-10">
                    {/* Left: Title */}
                    <div className="flex-1 flex items-center">
                        <h2 className="text-sm font-semibold text-white tracking-wide capitalize hidden md:block">
                            {activeTab.replace('-', ' ')}
                        </h2>
                    </div>
                    
                    {/* Center: Search Box */}
                    <div className="flex-[2] flex justify-center">
                        <Header 
                            setChartData={setChartData} 
                            interval={interval} 
                            onSymbolChange={setSelectedSymbol} 
                        />
                    </div>

                    {/* Right: Spacer for balance */}
                    <div className="flex-1"></div>
                </header>

                {/* DASHBOARD CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto">

                        {/* ========================================== */}
                        {/* TAB 1: MARKETS OVERVIEW (Default)          */}
                        {/* ========================================== */}
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Primary Chart */}
                                <div className="relative group col-span-1 md:col-span-2 lg:col-span-2 min-h-[320px] h-[calc(100vh-12rem)] max-h-[700px] rounded bg-[#0D1117] border border-white/[0.06] shadow-2xl flex flex-col overflow-hidden">
                                    <div className="h-14 shrink-0 border-b border-white/[0.04] flex items-center px-6 justify-between">
                                        <h2 className="text-sm font-semibold text-white">{selectedSymbol ?? "Primary Chart"}</h2>
                                        <div className="flex bg-black/20 rounded-lg p-1 border border-white/[0.03]">
                                            {['5m', '15m', '1h', '1d'].map((time) => (
                                                <button key={time} onClick={() => setInterval(time)} className={`text-xs px-3 py-1 rounded-md ${interval === time ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>{time}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full p-4 relative min-h-0">
                                        <CandlestickChart chartData={chartData} maLength={10} />
                                    </div>
                                </div>

                                {/* Stock Details */}
                                <div className="relative col-span-1 md:col-span-2 lg:col-span-1 min-h-[240px] lg:h-[calc(100vh-12rem)] lg:max-h-[700px] bg-[#0D1117] border rounded border-white/[0.06] shadow-2xl flex flex-col overflow-hidden">
                                    <StockDetails symbol={selectedSymbol} />
                                </div>

                                {/* Bottom Panel: Project Scope */}
                                <div className="relative col-span-1 md:col-span-2 lg:col-span-3 min-h-[250px] bg-[#0D1117] border rounded-xl border-white/[0.06] shadow-2xl overflow-hidden">
                                    <ProjectScopePanel />
                                </div>

                                
                            </div>
                        )}

                        {/* ========================================== */}
                        {/* TAB 2: STFT ANALYSIS                       */}
                        {/* ========================================== */}
                        {activeTab === "analysis" && (
                            <div className="flex flex-col gap-6">
                                
                                {/* 1. The Math Explanation */}
                                <STFTExplanation />

                                {/* 2. Placeholder for your future STFT Spectrogram Visualizer */}
                                <div className="min-h-[500px] bg-[#0D1117] border rounded-xl border-white/[0.06] shadow-2xl p-6 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Spectrogram Visualizer</h3>
                                    <p className="text-sm text-slate-500 max-w-md text-center">
                                        Select a stock ticker above to generate its time-frequency representation. The CNN will use this heatmap to predict future price movements.
                                    </p>
                                </div>

                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    )
}