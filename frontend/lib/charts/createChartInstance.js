import { createChart } from "lightweight-charts"

export default function createChartInstance(container) {
    return createChart(container, {
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
}