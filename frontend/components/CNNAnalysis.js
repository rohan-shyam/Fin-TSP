"use client"

import { useState, useEffect } from "react"
import BacktestChart from "@/lib/charts/BacktestChart";

export default function CNNAnalysis({ symbol }) {
  const [data, setData] = useState(null);
  const [backtestData, setBacktestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Today's Prediction
        const predRes = await fetch(`http://localhost:8000/predict?symbol=${symbol}`);
        if (!predRes.ok) throw new Error("Failed to fetch prediction");
        const predJson = await predRes.json();
        setData(predJson);

        // 2. Fetch Historical Backtest Data
        const btRes = await fetch(`http://localhost:8000/predict/backtest?symbol=${symbol}`);
        if (!btRes.ok) throw new Error("Failed to fetch backtest");
        const btJson = await btRes.json();
        setBacktestData(btJson);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // Task 4: Calculate Directional Accuracy
  const calculateAccuracy = (data) => {
    if (!data || data.length < 2) return "0.0";
    let hits = 0;
    for (let i = 1; i < data.length; i++) {
        const actualDir = data[i].actual > data[i-1].actual; // Did price actually go up?
        const predDir = data[i].predicted > data[i-1].actual; // Did model predict it would go up?
        if (actualDir === predDir) hits++;
    }
    return ((hits / (data.length - 1)) * 100).toFixed(1);
  };

  return (
    <div className="flex flex-col gap-6 p-2 bg-[#0B0E14] min-h-screen">
      
       {/* TASK 3: ARCHITECTURE VISUALIZATION */}
        <div className="flex items-center justify-between gap-2 py-8 overflow-x-auto no-scrollbar px-4">
            <ArchitectureNode title="Input" desc="Spectral Map" dims="[60, 60, 1]" color="bg-blue-500/10" border="border-blue-500/20" />
            <Arrow />
            <ArchitectureNode title="Conv2D" desc="Feature Kernels" dims="[30, 30, 32]" color="bg-purple-500/10" border="border-purple-500/20" />
            <Arrow />
            <ArchitectureNode title="MaxPool" desc="Downsample" dims="[15, 15, 32]" color="bg-slate-500/10" border="border-slate-500/20" />
            <Arrow />
            <ArchitectureNode title="Flatten" desc="Latent Vector" dims="[7200, 1]" color="bg-orange-500/10" border="border-orange-500/20" />
            <Arrow />
            <ArchitectureNode title="Dense" desc="Linear Head" dims="[1, 1]" color="bg-emerald-500/10" border="border-emerald-500/20" />
        </div>

        
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 mb-4">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Engine Status</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Universal</span>
                </span>
            </div>
            <div className="mt-2">
                <h4 className="text-xl font-mono font-bold text-white tracking-tighter">5,300+ <span className="text-xs text-slate-500 font-normal underline decoration-blue-500/50 underline-offset-4">Assets Supported</span></h4>
                <p className="text-[9px] text-slate-500 mt-1 leading-tight uppercase font-medium">
                    Cross-Sector Domain Generalization: NSE/BSE Universe
                </p>
            </div>
        </div>
      {/* TASK 4: ANALYSIS & PREDICTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prediction Display */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">CNN Target Prediction (T+1)</p>
          {loading ? (
            <div className="h-10 w-48 bg-white/5 animate-pulse rounded mt-2" />
          ) : (
            <div className="flex items-baseline gap-3">
                <h2 className="text-4xl font-mono font-bold text-white tracking-tighter">
                    ₹{data?.predicted_price || "0.00"}
                </h2>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${data?.direction === 'UP' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                    {data?.predicted_pct_change > 0 ? "+" : ""}{data?.predicted_pct_change}%
                </span>
            </div>
          )}
          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
            Neural inference computed via 2D Spectral analysis of price volatility.
          </p>
        </div>

        {/* Model Performance Stats */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Model Metadata</h4>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Accuracy: {calculateAccuracy(backtestData)}%
                </span>
            </div>
            <div className="space-y-3">
                <MetricRow label="Loss Function" value="Mean Squared Error" />
                <MetricRow label="Optimizer" value="Adam (lr=0.0005)" />
                <MetricRow label="Batch Size" value="32" />
                <MetricRow label="Target" value="Next Day % Return" />
            </div>
        </div>
      </div>

      {/* THE REAL DEAL: BACKTEST CHART */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
        <div className="flex justify-between items-center px-2 mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Historical Performance vs. Actual
            </h3>
        </div>
        <BacktestChart data={backtestData} />
      </div>

      {error && (
        <div className="text-rose-500 text-xs bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 animate-shake">
            ⚠️ Prediction Engine Error: {error}
        </div>
      )}
    </div>
  )
}

// 1. THE MISSING ARCHITECTURE NODE (Redesigned for GLOW)
function ArchitectureNode({ title, desc, dims, color, border }) {
  return (
    <div className={`relative flex-shrink-0 w-44 h-32 rounded-2xl border ${border} ${color} 
                    bg-white/[0.03] backdrop-blur-xl flex flex-col items-center justify-center 
                    text-center p-4 transition-all duration-500 hover:scale-105 group shadow-2xl`}>
      
      {/* Glow Effect on Hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 ${color}`} />

      {/* Top Label Badge */}
      <div className="absolute -top-3 left-6 px-3 py-1 bg-[#0B0E14] border border-inherit rounded-lg shadow-xl">
        <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">{title}</span>
      </div>
      
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-2">{desc}</span>
      
      {/* Tensor Dimensions (The "Pro" Detail) */}
      <div className="mt-4 px-4 py-1.5 bg-black/60 rounded-xl border border-white/5 font-mono shadow-inner">
        <span className="text-[12px] text-cyan-400 font-bold tracking-tighter group-hover:text-cyan-300 transition-colors">
          {dims}
        </span>
      </div>
    </div>
  )
}

// 2. THE ARROW COMPONENT
function Arrow() {
  return (
    <div className="flex flex-col items-center justify-center px-2 opacity-20">
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
         <path d="M5 12h14M12 5l7 7-7 7"/>
       </svg>
    </div>
  )
}

// 3. THE METRIC ROW COMPONENT
function MetricRow({ label, value }) {
    return (
        <div className="flex justify-between items-center border-b border-white/[0.03] pb-3 last:border-0">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-[12px] font-mono font-bold text-slate-200">{value}</span>
        </div>
    )
}