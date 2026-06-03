"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [wallet, setWallet] = useState<any>({
    available_balance: 0,
    total_earnings: 0,
    locked_collateral: 0,
  });
  const [investments, setInvestments] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "invest" | "deposit" | "withdraw" | "loans" | "history"
  >("overview");

  // Form states
  const [depositAmount, setDepositAmount] = useState("");
  const [depositAsset, setDepositAsset] = useState("USDT");
  const [txHash, setTxHash] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawNetwork, setWithdrawNetwork] = useState("ERC20");
  const [loanAmount, setLoanAmount] = useState("");
  const [investAmount, setInvestAmount] = useState("");
  const [investPlan, setInvestPlan] = useState("Amateur Growth (7.8%)");
  const [investApy, setInvestApy] = useState("0.078");
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  const depositWallets: Record<string, string> = {
    USDT: "0x742d35Cc6634C0532925a3b844Bc152e1B3f4e6B",
    USDC: "0x8BA34fd6aC8D3fA6ab4ad64c0c9Cf4df9e4C28B9",
    BTC: "3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy",
    ETH: "0x9876543210ABCDEFabcdef1234567890abcdef12",
  };

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

      const [
        { data: profileData },
        { data: walletData },
        { data: investmentData },
        { data: depositData },
        { data: txnData },
        { data: loanData },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionUser.id)
          .single(),
        supabase
          .from("apex_wallets")
          .select("*")
          .eq("id", sessionUser.id)
          .maybeSingle(),
        supabase
          .from("apex_investments")
          .select("*")
          .eq("id", sessionUser.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_deposit_requests")
          .select("*")
          .eq("id", sessionUser.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_transactions")
          .select("*")
          .eq("id", sessionUser.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_loans")
          .select("*")
          .eq("id", sessionUser.id)
          .order("created_at", { ascending: false }),
      ]);

      if (profileData) setProfile(profileData);
      if (walletData) setWallet(walletData);
      setInvestments(investmentData || []);
      setDeposits(depositData || []);
      setTransactions(txnData || []);
      setLoans(loanData || []);
    } catch (err: any) {
      showMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  }

  function showMsg(text: string, isError = false) {
    setMessage({ text, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 6000);
  }

  async function post(url: string, body: object) {
    setSubmitting(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "Success");
        fetchDashboardData();
      } else showMsg(data.error, true);
    } catch {
      showMsg("Network error. Please try again.", true);
    }
    setSubmitting(false);
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0 || !txHash.trim()) {
      showMsg(
        "Please fill in all deposit fields including the transaction hash.",
        true,
      );
      return;
    }
    await post("/api/deposit", {
      amount: depositAmount,
      asset_ticker: depositAsset,
      transaction_hash: txHash,
    });
    setDepositAmount("");
    setTxHash("");
  }

  async function handleInvestment(e: React.FormEvent) {
    e.preventDefault();
    if (!investAmount || parseFloat(investAmount) < 300) {
      showMsg("Minimum allocation is $300.", true);
      return;
    }
    await post("/api/invest", {
      plan_name: investPlan,
      amount: investAmount,
      apy: investApy,
    });
    setInvestAmount("");
  }

  async function handleWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    if (
      !withdrawAmount ||
      parseFloat(withdrawAmount) <= 0 ||
      !withdrawAddress
    ) {
      showMsg("Please provide a valid amount and wallet address.", true);
      return;
    }
    await post("/api/withdraw", {
      amount: withdrawAmount,
      wallet_address: withdrawAddress,
      network: withdrawNetwork,
    });
    setWithdrawAmount("");
    setWithdrawAddress("");
  }

  async function handleLoan(e: React.FormEvent) {
    e.preventDefault();
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      showMsg("Please provide a valid loan amount.", true);
      return;
    }
    await post("/api/loan", { amount: loanAmount });
    setLoanAmount("");
  }

  function copyToClipboard(address: string, asset: string) {
    navigator.clipboard.writeText(address);
    setCopiedAsset(asset);
    setTimeout(() => setCopiedAsset(null), 2000);
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
      approved: "bg-emerald-900/30 text-emerald-400 border-emerald-700/30",
      rejected: "bg-red-900/30 text-red-400 border-red-700/30",
      active: "bg-blue-900/30 text-blue-400 border-blue-700/30",
      completed: "bg-teal-900/30 text-teal-400 border-teal-700/30",
    };
    return `px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${map[status] || "bg-gray-900/30 text-gray-400 border-gray-700/30"}`;
  };

  const planOptions = [
    { label: "Stable-Tier Entry (5.2%)", apy: "0.052" },
    { label: "Amateur Growth (7.8%)", apy: "0.078" },
    { label: "Apex Thrive (11.4%)", apy: "0.114" },
    { label: "Institutional (15.6%)", apy: "0.156" },
  ];

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "deposit", label: "Deposit" },
    { key: "invest", label: "Invest" },
    { key: "withdraw", label: "Withdraw" },
    { key: "loans", label: "Credit Lines" },
    { key: "history", label: "History" },
  ] as const;

  if (loading)
    return (
      <div className="min-h-screen bg-[#060613] text-gray-100 flex items-center justify-center font-sans text-sm tracking-widest">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      {/* DASHBOARD HEADER */}
      <header className="sticky top-0 z-10 bg-[#07071a] border-b border-[#1e1e38] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black text-[#00d1b2] tracking-widest uppercase">APEX</h1>
          <p className="text-[10px] text-gray-500 font-mono">{profile?.full_name || user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {profile?.user_role === 'admin' && (
            <a href="/admin" className="text-xs border border-red-900/50 px-3 py-2 rounded text-red-400 hover:bg-red-900/20 transition uppercase tracking-wider">
              Admin Board
            </a>
          )}
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
            className="px-4 py-2 border border-red-500/40 text-red-400 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-red-500/10 transition"
          >
            Sign Out
          </button>
        </div>
      </header>
      {/* HEADER */}

      {/* FEEDBACK */}
      {message.text && (
        <div
          className={`mx-6 mt-4 p-3 rounded-xl border text-sm font-semibold ${message.isError ? "bg-red-950/40 border-red-500/40 text-red-400" : "bg-teal-950/40 border-[#00d1b2]/40 text-[#00d1b2]"}`}
        >
          {message.text}
        </div>
      )}

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* WALLET CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0f0f30] p-5 rounded-xl border border-[#1e1e38]">
            <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase block font-bold">
              Available Balance
            </span>
            <p className="text-3xl font-black mt-2 text-white font-mono">
              ${Number(wallet.available_balance || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-[#0f0f30] p-5 rounded-xl border border-[#1e1e38]">
            <span className="text-[9px] tracking-[0.2em] text-[#00d1b2] uppercase block font-bold">
              Total Earnings
            </span>
            <p className="text-3xl font-black mt-2 text-[#00d1b2] font-mono">
              ${Number(wallet.total_earnings || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-[#0f0f30] p-5 rounded-xl border border-[#1e1e38]">
            <span className="text-[9px] tracking-[0.2em] text-yellow-500/80 uppercase block font-bold">
              Locked Collateral
            </span>
            <p className="text-3xl font-black mt-2 text-yellow-400 font-mono">
              ${Number(wallet.locked_collateral || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 flex-wrap border-b border-[#1e1e38] pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition border-b-2 -mb-px ${activeTab === tab.key ? "border-[#00d1b2] text-[#00d1b2]" : "border-transparent text-gray-500 hover:text-gray-300"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Active Investments */}
            <div className="bg-[#0f0f30]/60 p-5 rounded-xl border border-[#1e1e38]/80">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                Active Investments
              </h2>
              {investments.filter((i) => i.status === "active").length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-3">
                    No active investments yet.
                  </p>
                  <button
                    onClick={() => setActiveTab("invest")}
                    className="text-[#00d1b2] text-xs underline"
                  >
                    Start investing →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments
                    .filter((i) => i.status === "active")
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="flex justify-between items-center p-4 bg-[#09091f] rounded-lg border border-[#1e1e38]/50"
                      >
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {inv.plan_name}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            Principal:{" "}
                            <span className="text-gray-300">
                              ${Number(inv.amount_invested).toFixed(2)}
                            </span>
                          </p>
                          <p className="text-gray-600 text-[10px]">
                            {inv.weeks_elapsed || 0} of{" "}
                            {inv.lock_duration_weeks || 52} weeks
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#00d1b2] font-black text-lg">
                            {(Number(inv.apy_percentage) * 100).toFixed(1)}%
                          </p>
                          <p className="text-gray-600 text-[9px] uppercase tracking-wider">
                            APY
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Recent Deposits */}
            <div className="bg-[#0f0f30]/60 p-5 rounded-xl border border-[#1e1e38]/80">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                Recent Deposits
              </h2>
              {deposits.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No deposits yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {deposits.slice(0, 5).map((dep) => (
                    <div
                      key={dep.id}
                      className="flex justify-between items-center p-3 bg-[#09091f] rounded-lg border border-[#1e1e38]/50"
                    >
                      <div>
                        <p className="text-white text-sm font-semibold">
                          ${Number(dep.amount_deposited).toFixed(2)}{" "}
                          <span className="text-gray-500 text-xs">
                            {dep.asset_ticker}
                          </span>
                        </p>
                        <p className="text-gray-600 text-[10px] font-mono truncate max-w-xs">
                          {dep.transaction_hash}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={statusBadge(dep.status)}>
                          {dep.status}
                        </span>
                        <p className="text-gray-600 text-[10px] mt-1">
                          {new Date(dep.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DEPOSIT TAB */}
        {activeTab === "deposit" && (
          <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-5 max-w-lg">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
              Fund Your Vault
            </h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                  Select Asset
                </label>
                <select
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-sm text-white focus:border-[#00d1b2] focus:outline-none"
                  value={depositAsset}
                  onChange={(e) => setDepositAsset(e.target.value)}
                >
                  {Object.keys(depositWallets).map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="bg-[#060613]/80 p-4 rounded-lg border border-[#1e1e38]/60">
                <label className="block text-[10px] text-gray-400 uppercase mb-2 tracking-wider font-bold">
                  Send {depositAsset} to this address
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
                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${copiedAsset === depositAsset ? "bg-emerald-600/80 text-white" : "bg-[#1e1e38] text-gray-300 hover:bg-[#2a2a50]"}`}
                  >
                    {copiedAsset === depositAsset ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                  Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="Amount in USD"
                  min="1"
                  step="0.01"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-sm text-white focus:border-[#00d1b2] focus:outline-none"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                  Blockchain Transaction Hash (TxID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste your transaction hash here"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-xs text-white placeholder-gray-600 font-mono focus:border-[#00d1b2] focus:outline-none"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  Transfer the crypto first, then paste the transaction hash
                  above to confirm.
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-[#00d1b2] text-[#060613] text-sm font-bold uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition"
              >
                {submitting ? "Submitting..." : "Submit Deposit"}
              </button>
            </form>
          </div>
        )}

        {/* INVEST TAB */}
        {activeTab === "invest" && (
          <div className="space-y-5 max-w-lg">
            <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                Initialize APY Contract
              </h2>
              <form onSubmit={handleInvestment} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                    Investment Plan
                  </label>
                  <select
                    className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-sm text-white focus:border-[#00d1b2] focus:outline-none"
                    value={investPlan}
                    onChange={(e) => {
                      setInvestPlan(e.target.value);
                      const plan = planOptions.find(
                        (p) => p.label === e.target.value,
                      );
                      if (plan) setInvestApy(plan.apy);
                    }}
                  >
                    {planOptions.map((p) => (
                      <option key={p.label}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                    Principal Amount ($)
                  </label>
                  <input
                    type="number"
                    placeholder="Min $300"
                    min="300"
                    step="0.01"
                    className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-sm text-white focus:border-[#00d1b2] focus:outline-none"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                  />
                </div>
                <div className="bg-[#060613] p-3 rounded-lg border border-[#1e1e38]/50 text-xs text-gray-400 space-y-1">
                  <p>
                    Selected APY:{" "}
                    <span className="text-[#00d1b2] font-bold">
                      {(parseFloat(investApy) * 100).toFixed(1)}%
                    </span>
                  </p>
                  {investAmount && parseFloat(investAmount) >= 300 && (
                    <>
                      <p>
                        Est. weekly yield:{" "}
                        <span className="text-white">
                          $
                          {(
                            (parseFloat(investAmount) * parseFloat(investApy)) /
                            52
                          ).toFixed(2)}
                        </span>
                      </p>
                      <p>
                        Est. annual yield:{" "}
                        <span className="text-white">
                          $
                          {(
                            parseFloat(investAmount) * parseFloat(investApy)
                          ).toFixed(2)}
                        </span>
                      </p>
                    </>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#00d1b2] text-[#060613] text-sm font-bold uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition"
                >
                  {submitting ? "Deploying..." : "Deploy Allocation"}
                </button>
              </form>
            </div>
            {investments.length > 0 && (
              <div className="bg-[#0f0f30]/60 p-5 rounded-xl border border-[#1e1e38]/80">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">
                  Your Investments
                </h3>
                <div className="space-y-2">
                  {investments.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex justify-between items-center p-3 bg-[#09091f] rounded-lg"
                    >
                      <div>
                        <p className="text-white text-xs font-semibold">
                          {inv.plan_name}
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          ${Number(inv.amount_invested).toFixed(2)} ·{" "}
                          {inv.weeks_elapsed || 0}/
                          {inv.lock_duration_weeks || 52} wks
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#00d1b2] font-bold text-sm">
                          {(Number(inv.apy_percentage) * 100).toFixed(1)}%
                        </span>
                        <span className={statusBadge(inv.status)}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WITHDRAW TAB */}
        {activeTab === "withdraw" && (
          <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4 max-w-lg">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
              Outward Settlement
            </h2>
            <div className="bg-[#060613] p-3 rounded-lg border border-[#1e1e38]/50">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Available to withdraw
              </p>
              <p className="text-2xl font-black text-white font-mono mt-1">
                ${Number(wallet.available_balance || 0).toFixed(2)}
              </p>
            </div>
            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                  Destination Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Paste your crypto wallet address"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-xs text-white font-mono focus:border-[#00d1b2] focus:outline-none"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                  Network
                </label>
                <select
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-sm text-white focus:border-[#00d1b2] focus:outline-none"
                  value={withdrawNetwork}
                  onChange={(e) => setWithdrawNetwork(e.target.value)}
                >
                  <option>ERC20</option>
                  <option>TRC20</option>
                  <option>BSC</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                  Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="Amount to withdraw"
                  min="1"
                  step="0.01"
                  className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-sm text-white focus:border-[#00d1b2] focus:outline-none"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-red-900/60 text-red-300 border border-red-500/30 text-sm font-bold uppercase tracking-wider disabled:opacity-50 hover:bg-red-800/60 transition"
              >
                {submitting ? "Processing..." : "Execute Withdrawal"}
              </button>
            </form>
          </div>
        )}

        {/* LOANS TAB */}
        {activeTab === "loans" && (
          <div className="space-y-5 max-w-lg">
            <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                Asset Credit Line
              </h2>
              <div className="bg-[#060613] p-3 rounded-lg border border-[#1e1e38]/50 text-xs text-gray-400 space-y-1">
                <p>
                  LTV Policy: <span className="text-white">50% maximum</span>
                </p>
                <p>
                  Required collateral:{" "}
                  <span className="text-white">
                    2× the loan amount in vault balance
                  </span>
                </p>
                <p>
                  Your balance:{" "}
                  <span className="text-[#00d1b2] font-bold">
                    ${Number(wallet.available_balance || 0).toFixed(2)}
                  </span>
                </p>
                <p>
                  Max credit line:{" "}
                  <span className="text-white">
                    ${(Number(wallet.available_balance || 0) / 2).toFixed(2)}
                  </span>
                </p>
              </div>
              <form onSubmit={handleLoan} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                    Credit Amount ($)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-sm text-white focus:border-[#00d1b2] focus:outline-none"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#1e1e38] text-white text-sm font-bold uppercase tracking-wider disabled:opacity-50 hover:bg-[#2a2a50] transition"
                >
                  {submitting ? "Submitting..." : "Request Credit Line"}
                </button>
              </form>
            </div>
            {loans.length > 0 && (
              <div className="bg-[#0f0f30]/60 p-5 rounded-xl border border-[#1e1e38]/80">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">
                  Your Credit Lines
                </h3>
                <div className="space-y-2">
                  {loans.map((loan) => (
                    <div
                      key={loan.id}
                      className="flex justify-between items-center p-3 bg-[#09091f] rounded-lg"
                    >
                      <div>
                        <p className="text-white text-sm font-semibold">
                          ${Number(loan.loan_principal).toFixed(2)}
                        </p>
                        {loan.total_due && (
                          <p className="text-gray-500 text-[10px]">
                            Due: ${Number(loan.total_due).toFixed(2)}
                          </p>
                        )}
                        <p className="text-gray-600 text-[10px]">
                          {new Date(loan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={statusBadge(loan.status)}>
                        {loan.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-[#0f0f30]/60 p-5 rounded-xl border border-[#1e1e38]/80">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                Transaction History
              </h2>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No transactions yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1e1e38] text-[10px] text-gray-500 uppercase tracking-widest">
                        <th className="text-left py-2 px-2">Type</th>
                        <th className="text-left py-2 px-2">Amount</th>
                        <th className="text-left py-2 px-2">Status</th>
                        <th className="text-left py-2 px-2">Description</th>
                        <th className="text-left py-2 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((txn) => {
                        const isCredit = [
                          "deposit",
                          "disbursement",
                          "payout",
                          "admin_credit",
                        ].includes(txn.type);
                        return (
                          <tr
                            key={txn.id}
                            className="border-b border-[#1e1e38]/40 hover:bg-white/5"
                          >
                            <td className="py-2.5 px-2 uppercase tracking-wide text-gray-300">
                              {txn.type.replace("_", " ")}
                            </td>
                            <td
                              className={`py-2.5 px-2 font-mono font-bold ${isCredit ? "text-[#00d1b2]" : "text-gray-400"}`}
                            >
                              {isCredit ? "+" : "-"}$
                              {Number(
                                txn.net_amount || txn.gross_amount || 0,
                              ).toFixed(2)}
                            </td>
                            <td className="py-2.5 px-2">
                              <span
                                className={statusBadge(
                                  txn.status || "completed",
                                )}
                              >
                                {txn.status || "completed"}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-gray-500 max-w-xs truncate">
                              {txn.description || "—"}
                            </td>
                            <td className="py-2.5 px-2 text-gray-500">
                              {new Date(txn.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
