export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 p-8 max-w-4xl mx-auto space-y-6 font-sans">
      <h1 className="text-3xl font-extrabold text-[#00d1b2] font-syne uppercase tracking-wider">Operational Architecture</h1>
      <p className="text-sm text-gray-400 font-light leading-relaxed">
        Apex Asset Management operates as a non-custodial software execution interface designed for algorithmic crypto wealth management. Founded with principles of strict network auditing and transparent portfolio logic, our platform handles private asset allocations without direct exposure to third-party leverage.
      </p>
      <h2 className="text-xl font-bold mt-8">Corporate Transparency</h2>
      <p className="text-sm text-gray-400 font-light leading-relaxed">
        Our underlying pools leverage verified distributed ledger smart contracts. By enforcing cold custody execution nodes for 95% of active reserves, we completely mitigate front-running and standard exchange liquidity risks.
      </p>
    </main>
  );
}
