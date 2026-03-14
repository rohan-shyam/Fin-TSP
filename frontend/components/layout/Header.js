export default function Header(){
    return(
        <>
       <header className="flex justify-between absolute space-between top-5 left-5 right-5">
        <div className="text-xl font-bold">
          Logo
        </div>
        <input type="text" className="bg-white rounded-2xl text-black pr-100 pl-4 py-3" placeholder="Search for stocks"/>

        <nav>
          Run Backtest
        </nav>
       </header>
       </>
    )
}