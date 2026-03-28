"use client"

import { useEffect, useRef } from "react"
import { CandlestickSeries, LineSeries } from "lightweight-charts"
import createChartInstance from "@/lib/charts/createChartInstance"
import { CalculateSMA } from "@/lib/indicators/sma"
import { CalculateEMA } from "@/lib/indicators/ema"

export default function CandlestickChart({ chartData, maLength = 20 }) {
    const chartContainerRef = useRef(null)
    const chartRef = useRef(null)
    const candleSeriesRef = useRef(null)
    const smaSeriesRef = useRef(null)
    const emaSeriesRef = useRef(null)

    // 1. Chart Initialization & Resize Handling
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart instance using your custom helper
        const chart = createChartInstance(chartContainerRef.current)
        chartRef.current = chart

        chart.applyOptions({
            timeScale: {
                minimumHeight: 32,
            },
            layout: {
                background: { type: 'solid', color: 'transparent' }, // Let parent bg show through
            }
        })

        // Add Series
        candleSeriesRef.current = chart.addSeries(CandlestickSeries)
        
        smaSeriesRef.current = chart.addSeries(LineSeries, {
            color: "#facc15", // Yellow
            lineWidth: 2
        })
        
        emaSeriesRef.current = chart.addSeries(LineSeries, {  
            color: "#3b82f6", // Blue
            lineWidth: 2
        })

        // Handle Window Resize dynamically
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ 
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight
                })
            }
        }

        window.addEventListener('resize', handleResize)

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize)
            if (chartRef.current) {
                chartRef.current.remove()
                chartRef.current = null
            }
        }
    }, [])

    // 2. Data Updates
    useEffect(() => {
        if (!chartData || chartData.length === 0) return;
        if (!candleSeriesRef.current || !smaSeriesRef.current || !emaSeriesRef.current) return;

        try {
            // Set the main candle data
            candleSeriesRef.current.setData(chartData)

            // Calculate and set indicators
            const smaData = CalculateSMA(chartData, maLength)
            const emaData = CalculateEMA(chartData, maLength)
            
            smaSeriesRef.current.setData(smaData)
            emaSeriesRef.current.setData(emaData)  

            // Auto-fit the chart to the new data
            chartRef.current.timeScale().fitContent()
            
        } catch (error) {
            console.error("Failed to render chart data:", error)
        }

    }, [chartData, maLength])

    return (
        // Changed to h-full and removed borders so it seamlessly fits the parent panel
        <div className="w-full h-full min-h-[400px] relative overflow-hidden">
            
            {/* The Chart Container */}
            <div ref={chartContainerRef} className="w-full h-full absolute inset-0 z-0" />

            {/* Fallback UI: Redesigned Terminal Aesthetic */}
            {(!chartData || chartData.length === 0) && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0B0E14]">
                    <div className="flex flex-col items-center justify-center p-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] max-w-md mx-4">
                        <svg className="w-8 h-8 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">
                            Awaiting Market Data
                        </p>
                        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                            Search for an asset to begin analysis, or try changing the timeframe if a ticker is already selected.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}