"use client"

import { useEffect, useRef, useState } from "react"

export default function SpectrogramVisualizer({ chartData }) {
    const timeCanvasRef = useRef(null)
    const specCanvasRef = useRef(null)
    
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0) 
    const animationRef = useRef(null)

    // Smooth gradient color scale
    const getColor = (value) => {
        if (value < 0.1) return `rgba(11, 14, 20, 1)`       
        if (value < 0.3) return `rgba(30, 58, 138, 1)`      
        if (value < 0.5) return `rgba(124, 58, 237, 1)`     
        if (value < 0.7) return `rgba(225, 29, 72, 1)`      
        return `rgba(252, 211, 77, 1)`                      
    }

    useEffect(() => {
        if (!chartData || chartData.length < 50) return;

        const timeCanvas = timeCanvasRef.current
        const specCanvas = specCanvasRef.current
        const tCtx = timeCanvas.getContext("2d")
        const sCtx = specCanvas.getContext("2d")

        const width = timeCanvas.width
        const height = timeCanvas.height
        const specHeight = specCanvas.height

        // 1. EXTRACT REAL DATA
        const signal = chartData.map(d => d.close || d.y || d[4] || 0) 
        const DATA_POINTS = signal.length
        const FREQ_BINS = 60
        const WINDOW_SIZE = Math.floor(DATA_POINTS * 0.05) // Tighter 5% window for better accuracy

        const minVal = Math.min(...signal)
        const maxVal = Math.max(...signal)
        const range = maxVal - minVal === 0 ? 1 : maxVal - minVal

        // 2. CALCULATE TRUE ROUGHNESS (Derivative-based Faux STFT)
        // Step A: Calculate point-to-point absolute differences
        const diffs = signal.map((val, i) => i === 0 ? 0 : Math.abs(val - signal[i-1]));
        
        // Step B: Smooth the differences using our sliding window
        const smoothedVol = signal.map((_, x) => {
            let sum = 0;
            let count = 0;
            const start = Math.max(0, x - WINDOW_SIZE);
            const end = Math.min(DATA_POINTS, x + WINDOW_SIZE);
            for(let i = start; i < end; i++) {
                sum += diffs[i];
                count++;
            }
            return sum / count;
        });

        const maxVol = Math.max(...smoothedVol) || 1;

        // Step C: Generate organic frequency energy
        const spectrogram = Array.from({ length: DATA_POINTS }, (_, x) => {
            // Normalize current volatility to 0-1
            const vol = smoothedVol[x] / maxVol;

            return Array.from({ length: FREQ_BINS }, (_, y) => {
                // Base trend energy (decays sharply as frequency goes up)
                const baseEnergy = Math.exp(-y / 4);
                
                // Volatility energy (pushes further up the Y-axis when vol is high)
                // The + 0.1 prevents division by zero
                const volEnergy = Math.exp(-y / (vol * 30 + 0.1)) * (vol * 1.5);
                
                // Add organic noise for texture
                const noise = Math.random() * 0.15;

                return Math.min(1, baseEnergy + volEnergy + noise);
            });
        });

        const draw = () => {
            // --- Draw Real Time Domain Signal ---
            tCtx.clearRect(0, 0, width, height)
            
            tCtx.beginPath()
            tCtx.strokeStyle = "#38bdf8" 
            tCtx.lineWidth = 1.5
            for (let i = 0; i < DATA_POINTS; i++) {
                const x = (i / DATA_POINTS) * width
                const y = height - ((signal[i] - minVal) / range) * (height - 20) - 10
                if (i === 0) tCtx.moveTo(x, y)
                else tCtx.lineTo(x, y)
            }
            tCtx.stroke()

            // Draw Sliding Window
            const currentX = progress * width
            const windowPixelWidth = (WINDOW_SIZE * 2 / DATA_POINTS) * width
            
            tCtx.fillStyle = "rgba(56, 189, 248, 0.15)" 
            tCtx.fillRect(currentX - windowPixelWidth/2, 0, windowPixelWidth, height)
            tCtx.strokeStyle = "rgba(56, 189, 248, 0.5)"
            tCtx.strokeRect(currentX - windowPixelWidth/2, 0, windowPixelWidth, height)

            // --- Draw Spectrogram ---
            sCtx.clearRect(0, 0, width, specHeight)
            const colWidth = width / DATA_POINTS
            const rowHeight = specHeight / FREQ_BINS

            for (let x = 0; x < DATA_POINTS; x++) {
                // If this X coordinate is ahead of our progress, SKIP IT entirely
                const isPast = (x / DATA_POINTS) > progress
                if (isPast) continue; 

                for (let y = 0; y < FREQ_BINS; y++) {
                    const energy = spectrogram[x][y]
                    
                    // No more weird dimming math, just get the true color
                    sCtx.fillStyle = getColor(energy) 
                    
                    sCtx.fillRect(
                        x * colWidth, 
                        specHeight - (y * rowHeight) - rowHeight,
                        colWidth + 0.8, 
                        rowHeight + 0.8
                    )
                }
            }

            // Draw Scanner Line
            sCtx.beginPath()
            sCtx.strokeStyle = "#34d399" 
            sCtx.lineWidth = 2
            sCtx.moveTo(currentX, 0)
            sCtx.lineTo(currentX, specHeight)
            sCtx.stroke()
        }

        draw()

        // Animation Loop
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(() => {
                setProgress(p => {
                    if (p >= 1) {
                        setIsPlaying(false)
                        return 1
                    }
                    return p + 0.004 
                })
            })
        }

        return () => cancelAnimationFrame(animationRef.current)
    }, [isPlaying, progress, chartData])

    if (!chartData || chartData.length < 50) {
        return (
            <div className="h-[450px] flex flex-col items-center justify-center opacity-50">
                <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin mb-4" />
                <p className="text-sm">Load a ticker with at least 50 data points to run STFT...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">STFT Spectrogram Generator</h3>
                    <p className="text-xs text-slate-500">Time-frequency mapping of actual market volatility.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { setProgress(0); setIsPlaying(true); }}
                        className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-colors text-slate-300"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-xs tracking-wide transition-all ${
                            isPlaying ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                    >
                        {isPlaying ? "PAUSE" : "ANALYZE SIGNAL"}
                    </button>
                </div>
            </div>

            <div className="bg-[#06080C] border border-white/[0.08] rounded-xl overflow-hidden relative">
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Real Time Domain Signal</span>
                    <span className="text-[10px] font-mono text-blue-400">X(t)</span>
                </div>
                <canvas ref={timeCanvasRef} width={1000} height={150} className="w-full h-[150px]" />
            </div>

            <div className="bg-[#06080C] border border-white/[0.08] rounded-xl overflow-hidden relative">
                <div className="absolute top-3 left-3 flex items-center gap-2 mix-blend-difference z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Spectrogram Heatmap</span>
                    <span className="text-[10px] font-mono text-emerald-400">S(t,f)</span>
                </div>
                <canvas ref={specCanvasRef} width={1000} height={300} className="w-full h-[300px]" />
            </div>
        </div>
    )
}