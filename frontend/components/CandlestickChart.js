"use client"

import { useEffect, useRef } from "react"
import { createChart, CandlestickSeries } from "lightweight-charts"

export default function CandlestickChart({ chartData }) {

    const chartContainer = useRef(null)
    const chart = useRef(null)
    const series = useRef(null)

    useEffect(() => {

        chart.current = createChart(chartContainer.current, {
            layout: {
                background: { color: "#0D1117" },
                textColor: "#94a3b8"
            },
            grid: {
                vertLines: { color: "rgba(255,255,255,0.03)" },
                horzLines: { color: "rgba(255,255,255,0.03)" }
            },
            autoSize: true
        })

        series.current = chart.current.addSeries(CandlestickSeries)

        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect
            chart.current.applyOptions({ width, height })
        })

        resizeObserver.observe(chartContainer.current)

        return () => {
            resizeObserver.disconnect()
            chart.current.remove()
        }

    }, [])

    useEffect(() => {
        if (series.current && chartData?.length) {
            
            series.current.setData(chartData)
        }
    }, [chartData])

    return (
    <div
        ref={chartContainer}
        style={{ width: "100%", height: "100%" }}
    />
    )
}