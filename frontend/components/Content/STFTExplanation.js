"use client"

export default function STFTExplanation() {
    return (
        <div className="flex flex-col gap-6 p-6 bg-[#0B0E14] text-slate-300 font-sans rounded-xl border border-white/[0.06]">
            {/* Header */}
            <div>
                <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Mathematical Foundation</h2>
                <h3 className="text-2xl font-bold text-white tracking-tight">Short-Time Fourier Transform</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Financial time series are typically non-stationary. To capture time-varying frequency content, STFT divides the signal into short, overlapping segments using a sliding window instead of processing it all at once.
                </p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Main Equation Card */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 relative overflow-hidden group hover:bg-white/[0.03] transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">STFT Function</p>
                
                {/* Beautifully styled native HTML Math */}
                <div className="font-serif text-xl md:text-2xl text-slate-200 flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <span className="italic text-white">STFT(t, f)</span>
                    <span className="text-blue-400 mx-2">=</span>
                    <span className="text-3xl text-slate-400 font-light">∫</span>
                    <div className="flex flex-col text-[10px] text-slate-500 -ml-1 mr-2 justify-between h-8">
                        <span>∞</span>
                        <span>-∞</span>
                    </div>
                    <span>
                        <i className="text-emerald-400">X(τ)</i> 
                        <span className="mx-1">·</span> 
                        <i className="text-rose-400">w(τ - t)</i> 
                        <span className="mx-1">·</span> 
                        e<sup className="text-sm text-slate-400">-j2πfτ</sup>
                    </span>
                    <i className="ml-2 text-slate-400">dτ</i>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-slate-400"><strong className="text-slate-200 font-medium">X(τ):</strong> Original Signal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="text-xs text-slate-400"><strong className="text-slate-200 font-medium">w(τ - t):</strong> Window Function</span>
                    </div>
                </div>
            </div>

            {/* Spectrogram & Sliding Window Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Spectrogram Card */}
                <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl p-5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">The Spectrogram</p>
                    <div className="font-serif text-lg text-slate-200 mb-3">
                        <i className="text-white">S(t, f)</i> = <span className="text-slate-400">|</span> <i className="text-blue-300">STFT(t, f)</i> <span className="text-slate-400">|</span><sup className="text-xs">2</sup>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Represents the energy distribution of the signal. Each window produces one column, and combining them forms a 2D image suitable for CNN processing.
                    </p>
                </div>

                {/* Resolution Trade-off Card */}
                <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl p-5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Resolution Trade-off</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300">Larger Window (L)</span>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Better Freq Resolution</span>
                        </div>
                        <div className="h-px w-full bg-white/[0.04]" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-300">Smaller Window</span>
                            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">Better Time Resolution</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}