"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  // Core Data States
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>({
    balance: 0,
    earnings_to_date: 0,
  });
  const [investments, setInvestments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive Form States
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawNetwork, setWithdrawNetwork] = useState("ERC20");
  const [loanAmount, setLoanAmount] = useState("");
  const [investAmount, setInvestAmount] = useState("");
  const [investPlan, setInvestPlan] = useState("Amateur Growth");
  const [investApy, setInvestApy] = useState("0.078");

  // Global Feedback System
  const [message, setMessage] = useState({ text: "", isError: false });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser();
      if (!sessionUser) {
        router.push("/login");
        return;
      }
      setUser(sessionUser);

      const { data: walletData } = await supabase
        .from("apex_wallets")
        .select("*")
        .maybeSingle();
      if (walletData) setWallet(walletData);

      const { data: investmentData } = await supabase
        .from("apex_investments")
        .select("*")
        .order("created_at", { ascending: false });
      setInvestments(investmentData || []);

      const { data: txnData } = await supabase
        .from("apex_transactions")
        .select("*")
        .order("created_at", { ascending: false });
      setTransactions(txnData || []);

      const { data: loanData } = await supabase
        .from("apex_loans")
        .select("*")
        .order("created_at", { ascending: false });
      setLoans(loanData || []);
    } catch (err: any) {
      showFeedback(err.message, true);
    } finally {
      setLoading(false);
    }
  }

  function showFeedback(text: string, isError = false) {
    setMessage({ text, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 5000);
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: depositAmount }),
    });
    const data = await res.json();
    if (data.success) {
      showFeedback("Deposit instruction recorded successfully.");
      setDepositAmount("");
      fetchDashboardData();
    } else {
      showFeedback(data.error, true);
    }
  }

  async function handleInvestment(e: React.FormEvent) {
    e.preventDefault();
    if (!investAmount || parseFloat(investAmount) <= 0) return;

    const res = await fetch("/api/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_name: investPlan,
        amount: investAmount,
        apy: investApy,
      }),
    });
    const data = await res.json();
    if (data.success) {
      showFeedback("Fixed APY contract initialized successfully.");
      setInvestAmount("");
      fetchDashboardData();
    } else {
      showFeedback(data.error, true);
    }
  }

  async function handleWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    if (!withdrawAmount || !withdrawAddress) return;

    const { error } = await supabase.from("apex_withdrawals").insert([
      {
        amount: parseFloat(withdrawAmount),
        wallet_address: withdrawAddress,
        network: withdrawNetwork,
      },
    ]);

    if (error) {
      showFeedback(error.message, true);
    } else {
      showFeedback("Withdrawal transaction added to processing pipeline.");
      setWithdrawAmount("");
      setWithdrawAddress("");
      fetchDashboardData();
    }
  }

  async function handleLoanRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!loanAmount) return;

    const principal = parseFloat(loanAmount);
    const requiredCollateral = principal * 2.0;

    const { error } = await supabase.from("apex_loans").insert([
      {
        amount_requested: principal,
        collateral_amount: requiredCollateral,
      },
    ]);

    if (error) {
      showFeedback(error.message, true);
    } else {
      showFeedback("Asset credit application successfully logged.");
      setLoanAmount("");
      fetchDashboardData();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060613] text-gray-100 flex items-center justify-center font-sans tracking-wide">
        Verifying Secure Administrative Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060613] text-gray-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── CLIENT DASHBOARD HEADER ── */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1e1e38] pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#00d1b2] tracking-wider uppercase">
              Apex Operations Node
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-1">
              SECURE UID: {user?.id}
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="px-5 py-2 border border-red-500/50 text-red-400 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-red-500 hover:text-white transition duration-200"
          >
            Terminate Session
          </button>
        </header>

        {/* ── FEEDBACK NOTIFICATION ── */}
        {message.text && (
          <div
            className={`p-4 rounded-xl border text-sm font-semibold tracking-wide ${
              message.isError
                ? "bg-red-950/40 border-red-500/50 text-red-400"
                : "bg-teal-950/40 border-[#00d1b2]/50 text-[#00d1b2]"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ── BALANCE LEDGERS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38] shadow-xl">
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase block font-bold">
              Liquid Vault Balance
            </span>
            <p className="text-4xl font-extrabold mt-2 text-white font-mono">
              ${wallet.balance.toFixed(2)}
            </p>
          </div>
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38] shadow-xl">
            <span className="text-[10px] tracking-[0.2em] text-[#00d1b2] uppercase block font-bold">
              Sustained APY Distributions
            </span>
            <p className="text-4xl font-extrabold mt-2 text-[#00d1b2] font-mono">
              ${wallet.earnings_to_date.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ── OPERATIONAL PANELS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* APY ALLOCATION INTERFACE */}
          <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
              Initialize APY Contract
            </h2>
            <form onSubmit={handleInvestment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">
                    Target Matrix
                  </label>
                  <select
                    className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-xs text-white"
                    value={investPlan}
                    onChange={(e) => {
                      setInvestPlan(e.target.value);
                      if (e.target.value === "Stable-Tier Entry")
                        setInvestApy("0.052");
                      if (e.target.value === "Amateur Growth")
                        setInvestApy("0.078");
                      if (e.target.value === "Apex Thrive")
                        setInvestApy("0.114");
                      if (e.target.value === "Institutional")
                        setInvestApy("0.156");
                    }}
                  >
                    <option value="Stable-Tier Entry">
                      Stable-Tier Entry (5.2%)
                    </option>
                    <option value="Amateur Growth">
                      Amateur Growth (7.8%)
                    </option>
                    <option value="Apex Thrive">Apex Thrive (11.4%)</option>
                    <option value="Institutional">Institutional (15.6%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">
                    Allocation Principal ($)
                  </label>
                  <input
                    type="number"
                    placeholder="Min $300"
                    className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2 text-xs text-white"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#00d1b2] text-black font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-[#00b89c] transition"
              >
                Deploy Allocation
              </button>
            </form>
          </div>

          {/* LIQUIDITY CREDIT INTAKE */}
          <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
              Draw Asset Credit
            </h2>
            <form onSubmit={handleLoanRequest} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  Credit Draw Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="Draw requirements amount"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2 text-xs text-white"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-gray-500">
                Drawings enforce a structural 50% LTV logic. Requested credit
                requires double its value in active vault assets.
              </p>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#1e1e38] text-white font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-[#2a2a50] transition"
              >
                Submit Credit Query
              </button>
            </form>
          </div>

          {/* FUNDING GATEWAY */}
          <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
              Inward Vault Funding
            </h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  Target Statement Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="Amount to deposit"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2 text-xs text-white"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#1e1e38] text-white font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-[#2a2a50] transition"
              >
                Generate Invoice
              </button>
            </form>
          </div>

          {/* OUTWARD PROCESSING DECK */}
          <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
              Outward Settlement Gateway
            </h2>
            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  Destination Token Address
                </label>
                <input
                  type="text"
                  placeholder="Paste corporate crypto address"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2 text-xs text-white"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  Network
                </label>
                <select
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-xs text-white"
                  value={withdrawNetwork}
                  onChange={(e) => setWithdrawNetwork(e.target.value)}
                >
                  <option value="ERC20">ERC20</option>
                  <option value="TRC20">TRC20</option>
                  <option value="BSC">BSC</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  Settlement Volume ($)
                </label>
                <input
                  type="number"
                  placeholder="Amount to withdraw"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2 text-xs text-white"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-red-900/60 text-red-300 font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-red-800/80 transition"
              >
                Execute Settlement
              </button>
            </form>
          </div>
        </div>

        {/* ── DATA TABLES ── */}

        {/* ACTIVE ALLOCATIONS */}
        <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
            Active Allocation Ledgers
          </h2>
          {investments.length === 0 ? (
            <p className="text-xs text-gray-500">
              No active yield matrix configurations mapped.
            </p>
          ) : (
            <table className="w-full text-xs text-gray-300">
              <thead>
                <tr className="text-[10px] text-gray-500 uppercase border-b border-[#1e1e38]">
                  <th className="text-left py-2 pr-4">Structure Plan</th>
                  <th className="text-left py-2 pr-4">Principal Allocation</th>
                  <th className="text-left py-2 pr-4">Configured Matrix</th>
                  <th className="text-left py-2">System Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#1e1e38]/50">
                    <td className="py-2 pr-4">{inv.plan_name}</td>
                    <td className="py-2 pr-4">
                      ${Number(inv.amount_invested).toFixed(2)}
                    </td>
                    <td className="py-2 pr-4">
                      {(Number(inv.apy_percentage) * 100).toFixed(1)}% APY
                    </td>
                    <td className="py-2">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* TRANSACTION HISTORY */}
        <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
            Account Ledger Audit Trail
          </h2>
          {transactions.length === 0 ? (
            <p className="text-xs text-gray-500">
              No transaction log entries found for this node framework.
            </p>
          ) : (
            <div className="space-y-2">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex justify-between items-center border-b border-[#1e1e38]/50 py-2 text-xs"
                >
                  <div>
                    <p className="font-semibold text-white capitalize">
                      {txn.type}
                    </p>
                    <p className="text-gray-500">
                      {txn.description || "System accounting allocation."}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        txn.type.includes("payout") ||
                        txn.type.includes("disbursement")
                          ? "text-[#00d1b2]"
                          : "text-gray-400"
                      }`}
                    >
                      {txn.type.includes("payout") ||
                      txn.type.includes("disbursement")
                        ? "+"
                        : "-"}
                      ${Number(txn.amount).toFixed(2)}
                    </p>
                    <p className="text-gray-600">
                      {new Date(txn.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
