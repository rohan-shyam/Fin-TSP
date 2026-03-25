"use client"

import { useEffect, useState } from "react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

// Improved Metric Component with better typography
function MetricCard({ label, value, subValue, highlight }) {
    return (
        <div className="flex flex-col gap-1.5 py-2">
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className={`text-lg font-semibold tabular-nums ${highlight ?? "text-slate-200"}`}>
                    {value ?? "—"}
                </p>
                {subValue && <span className="text-[10px] text-slate-500 font-medium">{subValue}</span>}
            </div>
        </div>
    )
}

export default function StockDetails({ symbol }) {
    const [info, setInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!symbol) { setInfo(null); return }
        const fetchInfo = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`${BACKEND_URL}/stock/info?symbol=${symbol}`)
                if (!res.ok) throw new Error("Connection lost")
                setInfo(await res.json())
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchInfo()
    }, [symbol])

    const formatCurrency = (val) => {
        if (val == null) return "—"
        const cr = val / 1e7
        return cr >= 1000 ? `₹${(cr / 1000).toFixed(2)}L Cr` : `₹${cr.toFixed(2)} Cr`
    }

    const isPositive = info?.change_pct >= 0

    return (
        <div className="flex flex-col h-full bg-[#0B0E14] text-slate-300 font-sans">
            {/* Header Section */}
            <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-white/[0.01] flex justify-between items-center">
                <div>
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Market Data</h2>
                    {info && <p className="text-[10px] text-blue-500 font-mono mt-0.5 px-1.5 py-0.5 bg-blue-500/10 rounded w-fit">{info.exchange}</p>}
                </div>
                {symbol && <span className="text-xl font-black italic text-white/20 tracking-tighter">{symbol}</span>}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!symbol && !loading && (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <div className="w-12 h-12 mb-4 rounded-full border border-dashed border-slate-700 flex items-center justify-center">
                            <span className="text-xl">↗</span>
                        </div>
                        <p className="text-sm font-medium">Select a ticker to analyze</p>
                    </div>
                )}

                {loading && (
                    <div className="h-full flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
                    </div>
                )}

                {info && !loading && (
                    <div className="p-6 space-y-8">
                        {/* Title & Price Hero */}
                        <section>
                            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-2">
                                {info.name ?? symbol}
                            </h1>
                            <p className="text-sm text-slate-500 mb-6">{info.sector || "General Equity"}</p>
                            
                            <div className="flex items-end gap-4">
                                <div className="text-5xl font-light text-white tracking-tighter">
                                    <span className="text-2xl mr-1 text-slate-500">₹</span>
                                    {Number(info.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </div>
                                <div className={`flex items-center gap-1 mb-2 px-2 py-1 rounded ${isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"}`}>
                                    <span className="text-xs font-bold">{isPositive ? "▲" : "▼"}</span>
                                    <span className="text-sm font-bold tabular-nums">{Math.abs(info.change_pct).toFixed(2)}%</span>
                                </div>
                            </div>
                        </section>

                        {/* Summary Grid */}
                        <section className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-white/[0.06] pt-8">
                            <MetricCard label="Market Cap" value={formatCurrency(info.market_cap)} />
                            <MetricCard label="P/E Ratio" value={info.pe_ratio?.toFixed(2)} subValue="TTM" />
                            <MetricCard label="Avg Volume" value={info.volume ? (info.volume / 1e6).toFixed(2) + "M" : "—"} />
                            <MetricCard label="Dividend" value={info.dividend_yield ? `${(info.dividend_yield * 100).toFixed(2)}%` : "0.00%"} />
                        </section>

                        {/* Range Visualizer (Modern 52w High/Low) */}
                        <section className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span>52W Low</span>
                                <span>52W High</span>
                            </div>
                            <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="absolute h-full bg-blue-500/40 rounded-full"
                                    style={{
                                        left: '20%', // Ideally calculate position relative to current price
                                        right: '20%'
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-sm font-mono font-medium">
                                <span className="text-rose-400">₹{info.week_52_low}</span>
                                <span className="text-emerald-400">₹{info.week_52_high}</span>
                            </div>
                        </section>

                        {/* Secondary Details */}
                        <section className="grid grid-cols-2 gap-4 opacity-80">
                            <div className="p-3 rounded-lg border border-white/[0.03] bg-white/[0.01]">
                                <p className="text-[10px] text-slate-500 uppercase mb-1">EPS</p>
                                <p className="text-sm font-medium text-slate-200">₹{info.eps ?? "—"}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-white/[0.03] bg-white/[0.01]">
                                <p className="text-[10px] text-slate-500 uppercase mb-1">Beta</p>
                                <p className="text-sm font-medium text-slate-200">{info.beta ?? "—"}</p>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}