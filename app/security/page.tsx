export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 p-8 max-w-4xl mx-auto space-y-8 font-sans">
      <header className="border-b border-[#1e1e38] pb-4">
        <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">Risk Management Protocols</h1>
        <p className="text-xs text-[#00d1b2] font-mono mt-1">System Operational Integrity Configuration</p>
      </header>
      
      <div className="space-y-6 text-sm text-gray-400 font-light leading-relaxed">
        <div>
          <h3 className="text-base font-bold text-white uppercase mb-2">Isolated Cold Storage Architecture</h3>
          <p>A maximum of 95% of active capital positions are kept within hardware-isolated multi-signature cold wallets, fully disconnected from internet-facing server nodes.</p>
        </div>
        <div>
          <h3 className="text-base font-bold text-white uppercase mb-2">Zero Directional Exposure</h3>
          <p>Apex Asset Management explicitly avoids delta-neutral long or short leveraged positions. All yield matrix distributions operate completely inside verified automated market-making pools.</p>
        </div>
      </div>
    </main>
  );
}
