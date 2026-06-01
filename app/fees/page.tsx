export default function FeesPage() {
  const fees = [
    { label: "Capital Deposit Handling Charge", value: "0.5%" },
    { label: "Standard Withdrawal Processing Charge", value: "1.5%" },
    { label: "Credit Line Setup Fee (Origination)", value: "1.0%" },
    { label: "Network Node Processing Gas Fee", value: "$2.00 flat" },
  ];

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 p-8 max-w-3xl mx-auto space-y-6 font-sans">
      <header className="border-b border-[#1e1e38] pb-4">
        <h1 className="text-3xl font-extrabold text-[#00d1b2] uppercase tracking-wider">Protocol Fee Schedules</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">Audit Ledger Transparency Specification</p>
      </header>
      
      <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl divide-y divide-[#1e1e38]/50">
        {fees.map((fee) => (
          <div key={fee.label} className="flex justify-between items-center p-5 text-sm">
            <span className="text-gray-400 font-light">{fee.label}</span>
            <span className="font-semibold text-[#00d1b2] font-mono">{fee.value}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
