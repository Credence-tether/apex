"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  // v3: balance, locked_collateral, total_earnings live on profiles
  const [investments, setInvestments] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "invest" | "deposit" | "withdraw" | "loans" | "history"
  >("overview");

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
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycIdType, setKycIdType] = useState("Passport");
  const [kycIdNumber, setKycIdNumber] = useState("");
  const [kycDocumentFile, setKycDocumentFile] = useState<File | null>(null);
  const [kycSelfieFile, setKycSelfieFile] = useState<File | null>(null);
  const [kycSubmitting, setKycSubmitting] = useState(false);
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

      // v3: all data from profiles + apex_master_requests
      const [
        { data: profileData },
        { data: investmentData },
        { data: depositData },
        { data: loanData },
        { data: kycData },
        { data: txnData },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", sessionUser.id).single(),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", sessionUser.id)
          .eq("request_type", "investment_purchase")
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", sessionUser.id)
          .eq("request_type", "deposit")
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", sessionUser.id)
          .eq("request_type", "loan_request")
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", sessionUser.id)
          .eq("request_type", "kyc_submission")
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", sessionUser.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (profileData) setProfile(profileData);

      // Normalize investments: flatten meta_data fields for display
      setInvestments(
        (investmentData || []).map((r: any) => ({
          ...r,
          plan_name: r.meta_data?.plan_name || "",
          amount_invested: r.amount,
          apy_percentage: r.meta_data?.apy_percentage || 0,
          lock_duration_weeks: r.meta_data?.lock_duration_weeks || 52,
          weeks_elapsed: r.meta_data?.weeks_elapsed || 0,
        })),
      );

      setDeposits(
        (depositData || []).map((r: any) => ({
          ...r,
          asset_ticker: r.meta_data?.asset_ticker || "USDT",
          transaction_hash: r.meta_data?.transaction_hash || "",
        })),
      );

      setLoans(
        (loanData || []).map((r: any) => ({
          ...r,
          total_due: r.meta_data?.total_due,
          interest_rate_annual: r.meta_data?.interest_rate_annual,
        })),
      );

      setKycRequests(
        (kycData || []).map((r: any) => ({
          ...r,
          id_type: r.meta_data?.id_type || "",
          id_number: r.meta_data?.id_number || "",
          document_url: r.meta_data?.document_url || "",
          selfie_url: r.meta_data?.selfie_url || "",
        })),
      );

      setTransactions(txnData || []);
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
        return true;
      }
      showMsg(data.error, true);
      return false;
    } catch {
      showMsg("Network error. Please try again.", true);
      return false;
    } finally {
      setSubmitting(false);
    }
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

  async function handleKycSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!kycIdNumber.trim() || !kycDocumentFile) {
      showMsg(
        "Please provide both document number and document file for KYC.",
        true,
      );
      return;
    }

    setKycSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id_type", kycIdType);
      formData.append("id_number", kycIdNumber);
      formData.append("document", kycDocumentFile);
      if (kycSelfieFile) {
        formData.append("selfie", kycSelfieFile);
      }
      formData.append("full_name", profile?.full_name || user?.email || "");

      const res = await fetch("/api/kyc", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "KYC submitted successfully");
        fetchDashboardData();
        setKycModalOpen(false);
        setKycIdNumber("");
        setKycDocumentFile(null);
        setKycSelfieFile(null);
      } else {
        showMsg(data.error, true);
      }
    } catch (err: any) {
      showMsg(err.message || "Failed to submit KYC", true);
    } finally {
      setKycSubmitting(false);
    }
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

  // v3: read balances from profile directly
  const balance = Number(profile?.balance || 0);
  const lockedCollateral = Number(profile?.locked_collateral || 0);
  const totalEarnings = Number(profile?.total_earnings || 0);

  if (loading)
    return (
      <div className="min-h-screen bg-[#060613] text-gray-100 flex items-center justify-center font-sans text-sm tracking-widest">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-[#07071a] border-b border-[#1e1e38] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black text-[#00d1b2] tracking-widest uppercase">
            APEX
          </h1>
          <p className="text-[10px] text-gray-500 font-mono">
            {profile?.full_name || user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message.text && (
            <span
              className={`text-xs px-3 py-1.5 rounded border ${message.isError ? "bg-red-950/40 text-red-400 border-red-700/40" : "bg-emerald-950/40 text-emerald-400 border-emerald-700/40"}`}
            >
              {message.text}
            </span>
          )}
          {profile?.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              className="text-xs border border-red-900/50 px-3 py-1.5 rounded text-red-400 hover:bg-red-900/20 transition uppercase tracking-wider"
            >
              Admin
            </button>
          )}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="text-xs border border-[#1e1e38] px-4 py-1.5 rounded text-gray-400 hover:border-gray-500 hover:text-gray-200 transition uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* KYC BANNER */}
      {profile && !profile.kyc_verified && (
        <div className="bg-yellow-900/20 border-b border-yellow-700/30 px-6 py-2 text-center">
          <p className="text-yellow-400 text-xs">
            KYC Status:{" "}
            <span className="font-bold uppercase">{profile.kyc_status}</span> —
            Complete identity verification to unlock full features.
          </p>
        </div>
      )}

      {profile && !profile.kyc_verified && (
        <div className="bg-[#07071a] border-b border-[#1e1e38] px-6 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Identity verification required
              </p>
              <p className="text-sm text-white mt-1">
                Submit your KYC documents so your account can be approved by
                operations.
              </p>
            </div>
            <button
              onClick={() => setKycModalOpen(true)}
              className="inline-flex items-center justify-center rounded-lg bg-[#00d1b2] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#060613] transition hover:bg-[#00e6bb]"
            >
              {kycRequests.length > 0 && kycRequests[0]?.status === "rejected"
                ? "Resubmit KYC"
                : "Submit KYC"}
            </button>
          </div>
        </div>
      )}

      {/* BALANCE BAR */}
      <div className="grid grid-cols-3 gap-px bg-[#1e1e38]/20 border-b border-[#1e1e38]/30">
        {[
          {
            label: "Available Balance",
            value: `$${balance.toFixed(2)}`,
            color: "text-white",
          },
          {
            label: "Locked in Investments",
            value: `$${lockedCollateral.toFixed(2)}`,
            color: "text-blue-400",
          },
          {
            label: "Total Earnings",
            value: `$${totalEarnings.toFixed(2)}`,
            color: "text-[#00d1b2]",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#07071a] px-5 py-4">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">
              {stat.label}
            </p>
            <p className={`text-xl font-black font-mono mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
        {/* TABS */}
        <div className="flex gap-1 flex-wrap border-b border-[#1e1e38]/40 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition ${activeTab === tab.key ? "bg-[#1e1e38] text-[#00d1b2] border border-[#00d1b2]/30" : "text-gray-500 hover:text-gray-300"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Deposits */}
              <div className="bg-[#0f0f30]/60 p-5 rounded-xl border border-[#1e1e38]/80">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Recent Deposits
                </h3>
                {deposits.length === 0 ? (
                  <p className="text-gray-600 text-xs italic">
                    No deposits yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {deposits.slice(0, 3).map((dep) => (
                      <div
                        key={dep.id}
                        className="flex justify-between items-center p-2.5 bg-[#09091f] rounded-lg"
                      >
                        <div>
                          <p className="text-white text-sm font-semibold">
                            ${Number(dep.amount).toFixed(2)}{" "}
                            <span className="text-gray-500 text-[10px]">
                              {dep.asset_ticker}
                            </span>
                          </p>
                          <p className="text-gray-600 text-[10px]">
                            {new Date(dep.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={statusBadge(dep.status)}>
                          {dep.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Investments */}
              <div className="bg-[#0f0f30]/60 p-5 rounded-xl border border-[#1e1e38]/80">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Active Investments
                </h3>
                {investments.length === 0 ? (
                  <p className="text-gray-600 text-xs italic">
                    No investments yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {investments.slice(0, 3).map((inv) => (
                      <div
                        key={inv.id}
                        className="flex justify-between items-center p-2.5 bg-[#09091f] rounded-lg"
                      >
                        <div>
                          <p className="text-white text-xs font-semibold">
                            {inv.plan_name}
                          </p>
                          <p className="text-gray-500 text-[10px]">
                            ${Number(inv.amount_invested).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#00d1b2] font-bold text-sm">
                            {(Number(inv.apy_percentage) * 100).toFixed(1)}%
                          </p>
                          <span className={statusBadge(inv.status)}>
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  label: "Deposit Funds",
                  tab: "deposit" as const,
                  color: "border-[#00d1b2]/40 text-[#00d1b2]",
                },
                {
                  label: "Invest",
                  tab: "invest" as const,
                  color: "border-blue-500/40 text-blue-400",
                },
                {
                  label: "Withdraw",
                  tab: "withdraw" as const,
                  color: "border-red-500/40 text-red-400",
                },
                {
                  label: "Credit Line",
                  tab: "loans" as const,
                  color: "border-yellow-500/40 text-yellow-400",
                },
              ].map((action) => (
                <button
                  key={action.tab}
                  onClick={() => setActiveTab(action.tab)}
                  className={`p-3 rounded-xl border bg-[#0f0f30]/40 text-xs font-bold uppercase tracking-wider hover:bg-[#1e1e38]/60 transition ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DEPOSIT TAB */}
        {activeTab === "deposit" && (
          <div className="bg-[#0f0f30]/60 p-6 rounded-xl border border-[#1e1e38]/80 space-y-4 max-w-lg">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
              Fund Your Account
            </h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                  Select Asset
                </label>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(depositWallets).map((asset) => (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => setDepositAsset(asset)}
                      className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider border transition ${depositAsset === asset ? "border-[#00d1b2] text-[#00d1b2] bg-[#00d1b2]/10" : "border-[#1e1e38] text-gray-400 hover:border-gray-500"}`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1.5 tracking-wider">
                  Deposit Address
                </label>
                <div className="flex gap-2 items-center">
                  <code className="flex-1 bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-[10px] text-gray-300 font-mono break-all">
                    {depositWallets[depositAsset]}
                  </code>
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
                  <p className="text-[10px] text-gray-600">
                    Investment requests require admin approval. Funds are
                    escrowed immediately.
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
                ${balance.toFixed(2)}
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
                    ${balance.toFixed(2)}
                  </span>
                </p>
                <p>
                  Max credit line:{" "}
                  <span className="text-white">
                    ${(balance / 2).toFixed(2)}
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
                          ${Number(loan.amount).toFixed(2)}
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
                        <th className="text-left py-2 px-2">Details</th>
                        <th className="text-left py-2 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((txn) => {
                        const isCredit = ["deposit", "loan_request"].includes(
                          txn.request_type,
                        );
                        const typeLabel =
                          txn.request_type?.replace(/_/g, " ") || "—";
                        return (
                          <tr
                            key={txn.id}
                            className="border-b border-[#1e1e38]/40 hover:bg-white/5"
                          >
                            <td className="py-2.5 px-2 uppercase tracking-wide text-gray-300">
                              {typeLabel}
                            </td>
                            <td
                              className={`py-2.5 px-2 font-mono font-bold ${isCredit ? "text-[#00d1b2]" : "text-gray-400"}`}
                            >
                              {isCredit ? "+" : "-"}$
                              {Number(txn.amount || 0).toFixed(2)}
                            </td>
                            <td className="py-2.5 px-2">
                              <span
                                className={statusBadge(txn.status || "pending")}
                              >
                                {txn.status || "pending"}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 text-gray-500 max-w-xs truncate">
                              {txn.meta_data?.plan_name ||
                                txn.meta_data?.asset_ticker ||
                                txn.meta_data?.network ||
                                "—"}
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
        {kycModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-3xl border border-[#1e1e38] bg-[#07071a] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                    Submit KYC Verification
                  </h2>
                  <p className="text-[10px] text-gray-400">
                    Provide document details for manual review.
                  </p>
                </div>
                <button
                  onClick={() => setKycModalOpen(false)}
                  className="text-gray-500 text-xs uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
              <form onSubmit={handleKycSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Document Type
                  </label>
                  <select
                    value={kycIdType}
                    onChange={(e) => setKycIdType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#1e1e38] bg-[#0b0b1a] px-3 py-2 text-sm text-white"
                  >
                    <option>Passport</option>
                    <option>Driver's License</option>
                    <option>National ID</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Document Number
                  </label>
                  <input
                    value={kycIdNumber}
                    onChange={(e) => setKycIdNumber(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#1e1e38] bg-[#0b0b1a] px-3 py-2 text-sm text-white"
                    placeholder="Enter document number"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Document File
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setKycDocumentFile(e.target.files?.[0] || null)
                    }
                    className="mt-2 w-full rounded-xl border border-[#1e1e38] bg-[#0b0b1a] px-3 py-2 text-sm text-white"
                  />
                  {kycDocumentFile && (
                    <p className="mt-1 text-xs text-green-400">
                      ✓ {kycDocumentFile.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Selfie / Proof File (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setKycSelfieFile(e.target.files?.[0] || null)
                    }
                    className="mt-2 w-full rounded-xl border border-[#1e1e38] bg-[#0b0b1a] px-3 py-2 text-sm text-white"
                  />
                  {kycSelfieFile && (
                    <p className="mt-1 text-xs text-green-400">
                      ✓ {kycSelfieFile.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={kycSubmitting}
                    className="flex-1 rounded-xl bg-[#00d1b2] px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#060613] disabled:opacity-50"
                  >
                    {kycSubmitting ? "Submitting..." : "Send KYC Request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setKycModalOpen(false)}
                    className="flex-1 rounded-xl border border-[#1e1e38] px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
