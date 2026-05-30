"use client";
import { useEffect, useState } from "react";
import {
  createClient,
  getSupabaseClientError,
} from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "investments" | "transactions"
  >("overview");
  const envError = getSupabaseClientError();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/login");
          return;
        }

        setUser(authUser);

        // Fetch wallet data from apex_wallets
        const { data: walletData, error: walletError } = await supabase
          .from("apex_wallets")
          .select("*")
          .eq("user_id", authUser.id)
          .single();

        if (walletError && walletError.code !== "PGRST116") {
          console.warn("Wallet fetch error:", walletError);
        }

        // Fetch active investments
        const { data: investmentData, error: investError } = await supabase
          .from("apex_investments")
          .select("*")
          .eq("user_id", authUser.id)
          .eq("status", "active");

        if (investError && investError.code !== "PGRST116") {
          console.warn("Investment fetch error:", investError);
        }

        // Fetch pending/approved deposits
        const { data: depositData, error: depositError } = await supabase
          .from("apex_deposit_requests")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (depositError && depositError.code !== "PGRST116") {
          console.warn("Deposit fetch error:", depositError);
        }

        // Fetch recent transactions
        const { data: transactionData, error: txError } = await supabase
          .from("apex_transactions")
          .select("*")
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (txError && txError.code !== "PGRST116") {
          console.warn("Transaction fetch error:", txError);
        }

        setWallet(
          walletData || {
            available_balance: 0,
            total_earnings: 0,
            locked_collateral: 0,
            user_id: authUser.id,
          },
        );
        setInvestments(investmentData || []);
        setDeposits(depositData || []);
        setTransactions(transactionData || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase, router]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#060613] text-white flex items-center justify-center">
        Loading Asset Account...
      </div>
    );

  if (envError) {
    return (
      <div className="min-h-screen bg-[#060613] text-white flex items-center justify-center p-4">
        <div className="bg-[#0f0f30] p-8 rounded-xl border border-[#1e1e38] max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-4">
            Configuration Required
          </h2>
          <p className="text-gray-400 mb-4">{envError}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-2 bg-[#00d1b2] text-[#060613] font-bold rounded hover:opacity-90 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#060613] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8 border-b border-[#1e1e38] pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#00d1b2]">
              Apex Client Portal
            </h1>
            {user && (
              <p className="text-sm text-gray-400 mt-1">
                Logged in as {user.email}
              </p>
            )}
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="px-4 py-2 border border-red-500 text-red-500 rounded text-sm hover:bg-red-500 hover:text-white transition"
          >
            Secure Log Out
          </button>
        </header>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* WALLET BALANCE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <p className="text-gray-400 text-sm uppercase font-semibold">
              Available Balance
            </p>
            <p className="text-4xl font-bold mt-2 text-white">
              ${wallet?.available_balance?.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <p className="text-gray-400 text-sm uppercase font-semibold">
              Total Earnings
            </p>
            <p className="text-4xl font-bold mt-2 text-[#00d1b2]">
              ${wallet?.total_earnings?.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <p className="text-gray-400 text-sm uppercase font-semibold">
              Locked Collateral
            </p>
            <p className="text-4xl font-bold mt-2 text-yellow-500">
              ${wallet?.locked_collateral?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowDepositForm(!showDepositForm)}
            className="px-4 py-3 bg-[#00d1b2] text-[#060613] font-bold rounded hover:opacity-90 transition"
          >
            + Deposit Funds
          </button>
          <button
            onClick={() => alert("Withdraw feature coming soon")}
            className="px-4 py-3 border border-[#00d1b2] text-[#00d1b2] font-bold rounded hover:bg-[#00d1b2]/10 transition"
          >
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className="px-4 py-3 border border-gray-500 text-gray-400 font-bold rounded hover:bg-gray-500/10 transition"
          >
            Transactions
          </button>
          <button
            onClick={() => alert("Payment methods coming soon")}
            className="px-4 py-3 border border-gray-500 text-gray-400 font-bold rounded hover:bg-gray-500/10 transition"
          >
            Payment Methods
          </button>
        </div>

        {/* DEPOSIT FORM */}
        {showDepositForm && (
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38] mb-8">
            <h3 className="text-lg font-bold mb-4">Request Deposit</h3>
            <p className="text-gray-400 text-sm mb-4">
              Submit a deposit request. Our team will review and process it
              within 1-2 business days.
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Amount in USD"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="flex-1 p-3 rounded bg-[#09091f] border border-[#1e1e38] text-white placeholder-gray-500"
              />
              <button
                onClick={async () => {
                  if (!depositAmount || parseFloat(depositAmount) <= 0) {
                    alert("Please enter a valid amount");
                    return;
                  }
                  // Insert deposit request
                  const { error } = await supabase
                    .from("apex_deposit_requests")
                    .insert({
                      user_id: user?.id,
                      amount_deposited: parseFloat(depositAmount),
                      status: "pending",
                    });

                  if (error) {
                    alert("Failed to submit deposit: " + error.message);
                  } else {
                    alert(`Deposit request for $${depositAmount} submitted!`);
                    setDepositAmount("");
                    setShowDepositForm(false);
                    // Refresh deposits
                    const { data } = await supabase
                      .from("apex_deposit_requests")
                      .select("*")
                      .eq("user_id", user?.id)
                      .order("created_at", { ascending: false })
                      .limit(5);
                    setDeposits(data || []);
                  }
                }}
                className="px-6 py-3 bg-[#00d1b2] text-[#060613] font-bold rounded hover:opacity-90 transition"
              >
                Submit
              </button>
              <button
                onClick={() => setShowDepositForm(false)}
                className="px-6 py-3 border border-gray-500 text-gray-400 rounded hover:bg-gray-500/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b border-[#1e1e38]">
          {(["overview", "investments", "transactions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold uppercase text-sm transition ${
                activeTab === tab
                  ? "text-[#00d1b2] border-b-2 border-[#00d1b2]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT - OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6">
            {/* RECENT DEPOSITS */}
            <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
              <h2 className="text-xl font-bold mb-4">
                Recent Deposit Requests
              </h2>
              {deposits.length === 0 ? (
                <p className="text-gray-400">No deposit requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {deposits.map((dep) => (
                    <div
                      key={dep.id}
                      className="flex justify-between items-center p-4 bg-[#09091f] rounded border border-[#1e1e38]"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          ${dep.amount_deposited?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(dep.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm font-semibold ${
                          dep.status === "approved"
                            ? "bg-green-900/30 text-green-400"
                            : dep.status === "rejected"
                              ? "bg-red-900/30 text-red-400"
                              : "bg-yellow-900/30 text-yellow-400"
                        }`}
                      >
                        {dep.status?.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT - INVESTMENTS */}
        {activeTab === "investments" && (
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Active Investments</h2>
              <button
                onClick={() => alert("Create investment feature coming soon")}
                className="px-3 py-1 text-sm bg-[#00d1b2] text-[#060613] font-bold rounded hover:opacity-90 transition"
              >
                + New Investment
              </button>
            </div>
            {investments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No active investments yet.</p>
                <p className="text-sm text-gray-500">
                  Deposit funds to start earning APY on your assets.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex justify-between items-center p-4 bg-[#09091f] rounded border border-[#1e1e38]"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {inv.plan_name}
                      </p>
                      <p className="text-sm text-gray-400">
                        Principal: ${inv.amount_invested?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inv.weeks_elapsed} of {inv.lock_duration_weeks} weeks
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#00d1b2] font-bold text-lg">
                        {(inv.apy_percentage * 100).toFixed(1)}% APY
                      </p>
                      <p className="text-xs text-gray-500">{inv.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT - TRANSACTIONS */}
        {activeTab === "transactions" && (
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-400">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-4 bg-[#09091f] rounded border border-[#1e1e38]"
                  >
                    <div>
                      <p className="font-semibold text-white capitalize">
                        {tx.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          tx.type === "deposit"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.type === "deposit" ? "+" : "-"}$
                        {tx.net_amount?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Net: ${tx.net_amount?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
