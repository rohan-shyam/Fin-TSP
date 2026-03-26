"use client"

// Helper components for the pipeline visualization
function PipelineBadge({ label, color = "slate" }) {
    const colors = {
        slate: "bg-white/[0.04] text-slate-300 border-white/[0.06]",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    }
    return (
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border shadow-sm ${colors[color]}`}>
            {label}
        </div>
    )
}

function Arrow() {
    return (
        <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    )
}

export default function ProjectScopePanel() {
    return (
        <div className="flex flex-col h-full bg-[#0B0E14]">
            {/* Header Area */}
            <div className="shrink-0 px-6 py-4 border-b border-white/[0.04] bg-white/[0.01] flex justify-between items-center">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Project Scope</h2>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 flex flex-col gap-6 lg:gap-8 justify-center">
                
                {/* Title & Objective */}
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                        Pattern Recognition for Financial Time Series
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">
                        The objective of this project is to explore how time-frequency signal processing and deep learning can be combined to predict stock prices. Financial variables are treated as non-stationary signals, transformed via Short-Time Fourier Transform (STFT), and fed into a Convolutional Neural Network (CNN) for regression modeling.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Multivariate Signal Vector */}
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 hover:bg-white/[0.03] transition-colors">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Multivariate Signal Vector</p>
                        
                        <div className="font-serif text-lg md:text-xl text-slate-200 flex flex-wrap items-center gap-2 mb-4">
                            <i className="text-white">X(t)</i> <span className="text-blue-400">=</span> 
                            <span className="text-slate-500">[</span>
                            <span className="text-emerald-400 italic">p(t)</span>, 
                            <span className="text-rose-400 italic">r(t)</span>, 
                            <span className="text-amber-400 italic">g(t)</span>, 
                            <span className="text-violet-400 italic">s(t)</span>, 
                            <span className="text-cyan-400 italic">d(t)</span>
                            <span className="text-slate-500">]</span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                            <span className="text-xs text-slate-500"><strong className="text-emerald-400 font-medium">p:</strong> Stock Price</span>
                            <span className="text-xs text-slate-500"><strong className="text-rose-400 font-medium">r:</strong> Revenue</span>
                            <span className="text-xs text-slate-500"><strong className="text-amber-400 font-medium">g:</strong> Profit</span>
                            <span className="text-xs text-slate-500"><strong className="text-violet-400 font-medium">s:</strong> Sensex</span>
                            <span className="text-xs text-slate-500"><strong className="text-cyan-400 font-medium">d:</strong> USD-INR</span>
                        </div>
                    </div>

                    {/* System Pipeline */}
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">System Pipeline</p>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            <PipelineBadge label="Time Series Data" />
                            <Arrow />
                            <PipelineBadge label="STFT" color="blue" />
                            <Arrow />
                            <PipelineBadge label="Spectrogram" color="violet" />
                            <Arrow />
                            <PipelineBadge label="CNN Model" color="emerald" />
                            <Arrow />
                            <PipelineBadge label="Prediction" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}