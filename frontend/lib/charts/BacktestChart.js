"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType, AreaSeries, LineSeries } from "lightweight-charts"

export default function BacktestChart({ data }) {
    const chartContainerRef = useRef(null)
    const chartRef = useRef(null)

    useEffect(() => {
        if (!chartContainerRef.current || !data || data.length === 0) return

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "#0D1117" },
                textColor: "#94a3b8",
            },
            grid: {
                vertLines: { color: "rgba(255,255,255,0.03)" },
                horzLines: { color: "rgba(255,255,255,0.03)" },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
        })

        chartRef.current = chart

        const actualSeries = chart.addSeries(AreaSeries, {
            lineColor: '#38bdf8',
            topColor: 'rgba(56,189,248,0.2)',
            bottomColor: 'rgba(56,189,248,0)',
            lineWidth: 2,
        })

        const predictionSeries = chart.addSeries(LineSeries, {
            color: '#f43f5e',
            lineWidth: 2,
            lineStyle: 2,
        })

        const actualData = data.map(d => ({ time: d.time, value: d.actual }))
        const predData = data.map(d => ({ time: d.time, value: d.predicted }))

        actualSeries.setData(actualData)
        predictionSeries.setData(predData)

        chart.timeScale().fitContent()

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth
                })
            }
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            chart.remove()
        }
    }, [data])

    return (
        <div className="relative w-full h-[320px] bg-[#0D1117] border border-white/[0.05] rounded-xl overflow-hidden">
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    )
}