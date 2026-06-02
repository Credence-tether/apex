export default function LoansPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 p-8 max-w-4xl mx-auto space-y-8 font-sans">
      <header className="border-b border-[#1e1e38] pb-4">
        <h1 className="text-3xl font-extrabold text-[#00d1b2] uppercase tracking-wider">Asset-Backed Credit Lines</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">Protocol Layer: Liquidity Facilities</p>
      </header>
      
      <section className="space-y-4">
        <p className="text-sm text-gray-400 font-light leading-relaxed">
          Apex Asset Management provides automated dollar-denominated liquidity provisions leveraging your active portfolio balances as static collateral layers. This non-directional model completely eliminates margin liquidations while maintaining your underlying staking yields.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#0f0f30] p-5 rounded-xl border border-[#1e1e38]">
            <h3 className="text-sm font-bold text-white uppercase mb-2">50% LTV Limitation</h3>
            <p className="text-xs text-gray-400 font-light">Credit facility drawings require a strict 2:1 coverage ratio backed by cold custody storage reserves.</p>
          </div>
          <div className="bg-[#0f0f30] p-5 rounded-xl border border-[#1e1e38]">
            <h3 className="text-sm font-bold text-white uppercase mb-2">4.5% Fixed Origination</h3>
            <p className="text-xs text-gray-400 font-light">Interest metrics are flat-rate variables added onto the principal statement value upon closure parameters.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
