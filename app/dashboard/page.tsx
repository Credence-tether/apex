"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  // Core Data States
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>({
    available_balance: 0,
    total_earnings: 0,
  });
  const [investments, setInvestments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive Form States
  const [depositAmount, setDepositAmount] = useState("");
  const [depositAsset, setDepositAsset] = useState("USDT");
  const [txHash, setTxHash] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawNetwork, setWithdrawNetwork] = useState("ERC20");
  const [loanAmount, setLoanAmount] = useState("");
  const [investAmount, setInvestAmount] = useState("");
  const [investPlan, setInvestPlan] = useState("Amateur Growth");
  const [investApy, setInvestApy] = useState("0.078");

  // Global Feedback System
  const [message, setMessage] = useState({ text: "", isError: false });

  // Deposit Wallet Addresses by Asset
  const depositWallets: Record<string, string> = {
    USDT: "0x742d35Cc6634C0532925a3b844Bc152e1B3f4e6B",
    USDC: "0x8BA34fd6aC8D3fA6ab4ad64c0c9Cf4df9e4C28B9",
    BTC: "3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy",
    ETH: "0x9876543210ABCDEFabcdef1234567890abcdef12",
  };

  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);

  function copyToClipboard(address: string, asset: string) {
    navigator.clipboard.writeText(address);
    setCopiedAsset(asset);
    setTimeout(() => setCopiedAsset(null), 2000);
  }

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
    if (!depositAmount || parseFloat(depositAmount) <= 0 || !txHash.trim()) {
      showFeedback(
        "Please provide all necessary deposit details and payment hash values.",
        true,
      );
      return;
    }

    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: depositAmount,
        asset_ticker: depositAsset,
        transaction_hash: txHash,
      }),
    });
    const data = await res.json();
    if (data.success) {
      showFeedback(
        "Inward deposit instruction and transaction hash recorded for processing.",
      );
      setDepositAmount("");
      setTxHash("");
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
    if (
      !withdrawAmount ||
      parseFloat(withdrawAmount) <= 0 ||
      !withdrawAddress
    ) {
      showFeedback(
        "Please provide valid withdrawal amount and wallet address.",
        true,
      );
      return;
    }

    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: withdrawAmount,
        wallet_address: withdrawAddress,
        network: withdrawNetwork,
      }),
    });
    const data = await res.json();
    if (data.success) {
      showFeedback("Withdrawal transaction logged.");
      setWithdrawAmount("");
      setWithdrawAddress("");
      fetchDashboardData();
    } else {
      showFeedback(data.error, true);
    }
  }

  async function handleLoanRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      showFeedback("Please provide a valid credit draw amount.", true);
      return;
    }

    const res = await fetch("/api/loan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: loanAmount,
      }),
    });
    const data = await res.json();
    if (data.success) {
      showFeedback("Asset credit lines requested successfully.");
      setLoanAmount("");
      fetchDashboardData();
    } else {
      showFeedback(data.error, true);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060613] text-gray-100 flex items-center justify-center font-sans">
        Verifying Administrative Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060613] text-gray-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
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

        {/* FEEDBACK BANNER */}
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

        {/* WALLET SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase block font-bold">
              Liquid Vault Balance
            </span>
            <p className="text-4xl font-extrabold mt-2 text-white font-mono">
              ${wallet.available_balance.toFixed(2)}
            </p>
          </div>
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <span className="text-[10px] tracking-[0.2em] text-[#00d1b2] uppercase block font-bold">
              Sustained APY Distributions
            </span>
            <p className="text-4xl font-extrabold mt-2 text-[#00d1b2] font-mono">
              ${wallet.total_earnings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ACTION PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* APY ALLOCATION */}
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
                      if (e.target.value.includes("Stable"))
                        setInvestApy("0.052");
                      if (e.target.value.includes("Amateur"))
                        setInvestApy("0.078");
                      if (e.target.value.includes("Thrive"))
                        setInvestApy("0.114");
                      if (e.target.value.includes("Institutional"))
                        setInvestApy("0.156");
                    }}
                  >
                    <option>Stable-Tier Entry (5.2%)</option>
                    <option>Amateur Growth (7.8%)</option>
                    <option>Apex Thrive (11.4%)</option>
                    <option>Institutional (15.6%)</option>
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
                className="w-full py-2.5 rounded-lg bg-[#00d1b2] text-[#060613] text-xs font-bold uppercase tracking-wider"
              >
                Deploy Allocation
              </button>
            </form>
          </div>

          {/* LOAN / CREDIT */}
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
                  placeholder="Draw requirements volume"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2 text-xs text-white"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-gray-500 font-light">
                Drawings enforce a structural 50% LTV logic. Requested credit
                requires double its value in active vault assets.
              </p>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#1e1e38] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2a2a50] transition"
              >
                Submit Credit Query
              </button>
            </form>
          </div>

          {/* DEPOSIT */}
          <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
              Inward Vault Funding
            </h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  Asset Token
                </label>
                <select
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-xs text-white"
                  value={depositAsset}
                  onChange={(e) => setDepositAsset(e.target.value)}
                >
                  <option>USDT</option>
                  <option>USDC</option>
                  <option>BTC</option>
                  <option>ETH</option>
                </select>
              </div>
              <div className="bg-[#060613]/80 p-4 rounded-lg border border-[#1e1e38]/50">
                <label className="block text-[10px] text-gray-400 uppercase mb-2 font-bold">
                  Deposit Wallet Address
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={depositWallets[depositAsset] || ""}
                    className="flex-1 bg-[#0f0f30] border border-[#1e1e38] rounded-lg p-2 text-xs text-[#00d1b2] font-mono cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        depositWallets[depositAsset],
                        depositAsset,
                      )
                    }
                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${copiedAsset === depositAsset ? "bg-green-600/80 text-white" : "bg-[#1e1e38] text-gray-300 hover:bg-[#2a2a50]"}`}
                  >
                    {copiedAsset === depositAsset ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-[9px] text-gray-500 mt-2 font-light">
                  Send {depositAsset} to this address to fund your vault.
                </p>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  Target Statement Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="Volume amount"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2 text-xs text-white"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  Blockchain Transaction Hash (TxID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste network transaction receipt hash"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2 text-xs text-white placeholder-gray-600 font-mono"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#00d1b2] text-[#060613] text-xs font-bold uppercase tracking-wider"
              >
                Submit Deposit Receipt
              </button>
            </form>
          </div>

          {/* WITHDRAWAL */}
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
                  placeholder="Paste external crypto wallet"
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
                  <option>ERC20</option>
                  <option>TRC20</option>
                  <option>BSC</option>
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
                className="w-full py-2.5 rounded-lg bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider hover:bg-red-800/60 transition"
              >
                Execute Settlement
              </button>
            </form>
          </div>
        </div>

        {/* INVESTMENTS TABLE */}
        <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
            Active Allocation Ledgers
          </h2>
          {investments.length === 0 ? (
            <p className="text-xs text-gray-500 italic">
              No active yield matrix configurations mapped.
            </p>
          ) : (
            <table className="w-full text-xs text-gray-300">
              <thead>
                <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-[#1e1e38]">
                  <th className="text-left py-2">Structure Plan</th>
                  <th className="text-left py-2">Principal Allocation</th>
                  <th className="text-left py-2">Configured Matrix</th>
                  <th className="text-left py-2">System Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-[#1e1e38]/50 hover:bg-white/5"
                  >
                    <td className="py-2">{inv.plan_name}</td>
                    <td className="py-2">
                      ${Number(inv.amount_invested).toFixed(2)}
                    </td>
                    <td className="py-2">
                      {(Number(inv.apy_percentage) * 100).toFixed(1)}% APY
                    </td>
                    <td className="py-2 text-[#00d1b2]">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase border-b border-[#1e1e38] pb-2">
            Account Ledger Audit Trail
          </h2>
          {transactions.length === 0 ? (
            <p className="text-xs text-gray-500 italic">
              No transaction log entries found for this node framework.
            </p>
          ) : (
            <table className="w-full text-xs text-gray-300">
              <thead>
                <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-[#1e1e38]">
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => {
                  const isCredit =
                    txn.type.includes("payout") ||
                    txn.type.includes("disbursement");
                  return (
                    <tr
                      key={txn.id}
                      className="border-b border-[#1e1e38]/50 hover:bg-white/5"
                    >
                      <td className="py-2 uppercase tracking-wide">
                        {txn.type}
                      </td>
                      <td className="py-2 text-gray-500">
                        {txn.description || "System accounting allocation."}
                      </td>
                      <td
                        className={`py-2 font-bold ${isCredit ? "text-[#00d1b2]" : "text-gray-400"}`}
                      >
                        {isCredit ? "+" : "-"}${Number(txn.amount).toFixed(2)}
                      </td>
                      <td className="py-2 text-gray-500">
                        {new Date(txn.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
