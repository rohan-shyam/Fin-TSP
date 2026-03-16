export default function SearchDropdown({ open, results, onSelect }) {

    if (!open || results.length === 0) return null

    return (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#0D1117] border border-white/[0.06] rounded-lg shadow-xl z-50">

            {results.map((stock) => (
                <div
                    key={stock.symbol}
                    className="px-4 py-2 hover:bg-white/[0.05] cursor-pointer text-sm"
                    onClick={() => onSelect(stock.symbol)}
                >
                    {stock.symbol} — {stock.name}
                </div>
            ))}

        </div>
    )
}