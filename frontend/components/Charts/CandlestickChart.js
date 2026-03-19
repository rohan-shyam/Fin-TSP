"use client"

import { useEffect, useRef } from "react"
import { CandlestickSeries, LineSeries } from "lightweight-charts"
import createChartInstance from "@/lib/charts/createChartInstance"
import { CalculateSMA } from "@/lib/indicators/sma"
import { CalculateEMA } from "@/lib/indicators/ema"

export default function CandlestickChart({ chartData, maLength }) {

    const chartContainer = useRef(null)
    const chart = useRef(null)
    const candleSeries = useRef(null)
    const smaSeries = useRef(null)
    const emaSeries = useRef(null)

    // Chart initialization
    useEffect(() => {

        requestAnimationFrame(() => {

            chart.current = createChartInstance(chartContainer.current)

            candleSeries.current = chart.current.addSeries(CandlestickSeries)

            smaSeries.current = chart.current.addSeries(LineSeries, {
                color: "#facc15",
                lineWidth: 2
            })
            emaSeries.current = chart.current.addSeries(LineSeries, {  
                color: "#3b82f6",
                lineWidth: 2
            })

        })


        return () => {
            chart.current?.remove()
        }

    }, [])

    // Data updates
    useEffect(() => {

        if (!chartData?.length) return
        if (!candleSeries.current || !smaSeries.current) return

        candleSeries.current.setData(chartData)

        const smaData = CalculateSMA(chartData, maLength)
        const emaData = CalculateEMA(chartData, maLength)
        smaSeries.current.setData(smaData)
        emaSeries.current.setData(emaData)  
        

    }, [chartData, maLength])

    return (
        <div
            ref={chartContainer}
            className="w-full h-full relative"
        >

            {!chartData?.length && (
                <div className="absolute inset-0 flex items-center justify-center">

                    <div className="w-full h-full bg-gradient-to-br from-[#0D1117] via-[#0F141C] to-[#0D1117] animate-pulse flex items-center justify-center">

                        
                    </div>

                </div>
            )}

        </div>
    )
}