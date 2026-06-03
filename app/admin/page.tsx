"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

type Tab =
  | "deposits"
  | "withdrawals"
  | "loans"
  | "users"
  | "investments"
  | "transactions";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [data, setData] = useState<any>({
    deposits: [],
    withdrawals: [],
    loans: [],
    users: [],
    investments: [],
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("deposits");
  const [statusMsg, setStatusMsg] = useState({ text: "", isError: false });
  const [creditModal, setCreditModal] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({ open: false, userId: "", userName: "" });
  const [creditAmount, setCreditAmount] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadAdminRecords();
  }, []);

  async function loadAdminRecords() {
    const res = await fetch("/api/admin/actions");
    const json = await res.json();
    if (json.success) setData(json.payload);
    else if (json.error === "Unauthorized") router.push("/dashboard");
    setLoading(false);
  }

  function showMsg(text: string, isError = false) {
    setStatusMsg({ text, isError });
    setTimeout(() => setStatusMsg({ text: "", isError: false }), 5000);
  }

  async function doAction(body: object, actionKey: string) {
    setActionLoading(actionKey);
    const res = await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.success) {
      showMsg(json.message);
      loadAdminRecords();
    } else showMsg(json.error, true);
    setActionLoading(null);
  }

  async function handleCreditSubmit() {
    if (!creditAmount || parseFloat(creditAmount) <= 0) {
      showMsg("Enter a valid amount", true);
      return;
    }
    await doAction(
      {
        action: "credit_balance",
        user_id: creditModal.userId,
        credit_amount: creditAmount,
      },
      "credit",
    );
    setCreditModal({ open: false, userId: "", userName: "" });
    setCreditAmount("");
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-900/40 text-yellow-400 border-yellow-700/40",
      approved: "bg-emerald-900/40 text-emerald-400 border-emerald-700/40",
      rejected: "bg-red-900/40 text-red-400 border-red-700/40",
      active: "bg-blue-900/40 text-blue-400 border-blue-700/40",
      completed: "bg-teal-900/40 text-teal-400 border-teal-700/40",
    };
    return `px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${map[status] || "bg-gray-900/40 text-gray-400 border-gray-700/40"}`;
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    {
      key: "deposits",
      label: "Deposits",
      count: data.deposits.filter((d: any) => d.status === "pending").length,
    },
    {
      key: "withdrawals",
      label: "Withdrawals",
      count: data.withdrawals.filter((w: any) => w.status === "pending").length,
    },
    {
      key: "loans",
      label: "Loans",
      count: data.loans.filter((l: any) => l.status === "pending").length,
    },
    { key: "users", label: "Users" },
    { key: "investments", label: "Investments" },
    { key: "transactions", label: "Transactions" },
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-[#03030a] text-red-400 flex items-center justify-center font-mono text-sm tracking-widest">
        LOADING ADMIN CONTROL BOARD...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#03030a] text-gray-100 font-sans">
      {/* HEADER */}
      <header className="border-b border-red-900/30 bg-[#06060f] px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-black text-red-500 tracking-widest uppercase">
            Admin Control Board
          </h1>
          <p className="text-[10px] text-gray-600 font-mono mt-0.5">
            APEX OPERATIONS — OVERSEER ACCESS
          </p>
        </div>
        <div className="flex items-center gap-3">
          {statusMsg.text && (
            <span
              className={`text-xs px-3 py-1.5 rounded border ${statusMsg.isError ? "bg-red-950/40 text-red-400 border-red-700/40" : "bg-emerald-950/40 text-emerald-400 border-emerald-700/40"}`}
            >
              {statusMsg.text}
            </span>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs border border-gray-700 px-4 py-2 rounded text-gray-400 hover:border-gray-500 hover:text-gray-200 transition uppercase tracking-wider"
          >
            Exit Board
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="text-xs border border-red-900/50 px-4 py-2 rounded text-red-400 hover:bg-red-900/20 transition uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-[#1e1e38]/30 border-b border-[#1e1e38]/30">
        {[
          { label: "Total Users", value: data.users.length },
          {
            label: "Pending Deposits",
            value: data.deposits.filter((d: any) => d.status === "pending")
              .length,
          },
          {
            label: "Pending Withdrawals",
            value: data.withdrawals.filter((w: any) => w.status === "pending")
              .length,
          },
          {
            label: "Active Loans",
            value: data.loans.filter(
              (l: any) => l.status === "active" || l.status === "pending",
            ).length,
          },
          {
            label: "Active Investments",
            value: data.investments.filter((i: any) => i.status === "active")
              .length,
          },
          { label: "Total Transactions", value: data.transactions.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#06060f] px-5 py-4">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* TABS */}
        <div className="flex gap-1 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2 ${activeTab === tab.key ? "bg-red-900/30 text-red-400 border border-red-900/50" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* DEPOSITS TAB */}
        {activeTab === "deposits" && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              Deposit Requests
            </h2>
            {data.deposits.length === 0 ? (
              <p className="text-gray-600 text-xs italic">
                No deposit requests.
              </p>
            ) : (
              <div className="space-y-2">
                {data.deposits.map((dep: any) => (
                  <div
                    key={dep.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0b0b18] p-4 rounded-xl border border-[#1e1e38] gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white font-bold text-sm">
                          ${Number(dep.amount_deposited).toFixed(2)}
                        </p>
                        <span className="text-gray-500 text-xs">
                          {dep.asset_ticker || "USDT"}
                        </span>
                        <span className={statusBadge(dep.status)}>
                          {dep.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-[10px] font-mono truncate">
                        TxHash: {dep.transaction_hash}
                      </p>
                      <p className="text-gray-600 text-[10px] mt-0.5">
                        User: {dep.profiles?.full_name || dep.user_id} ·{" "}
                        {new Date(dep.created_at).toLocaleString()}
                      </p>
                    </div>
                    {dep.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() =>
                            doAction(
                              {
                                action: "approve_deposit",
                                target_table: "apex_deposit_requests",
                                target_id: dep.id,
                                target_status: "approved",
                              },
                              dep.id + "-approve",
                            )
                          }
                          disabled={actionLoading === dep.id + "-approve"}
                          className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-1.5 rounded font-bold uppercase text-[10px] tracking-wider disabled:opacity-50 transition"
                        >
                          {actionLoading === dep.id + "-approve"
                            ? "..."
                            : "Approve & Credit"}
                        </button>
                        <button
                          onClick={() =>
                            doAction(
                              {
                                target_table: "apex_deposit_requests",
                                target_id: dep.id,
                                target_status: "rejected",
                              },
                              dep.id + "-reject",
                            )
                          }
                          disabled={actionLoading === dep.id + "-reject"}
                          className="bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-900/40 px-4 py-1.5 rounded font-bold uppercase text-[10px] tracking-wider disabled:opacity-50 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* WITHDRAWALS TAB */}
        {activeTab === "withdrawals" && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              Withdrawal Requests
            </h2>
            {data.withdrawals.length === 0 ? (
              <p className="text-gray-600 text-xs italic">
                No withdrawal requests.
              </p>
            ) : (
              <div className="space-y-2">
                {data.withdrawals.map((w: any) => (
                  <div
                    key={w.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0b0b18] p-4 rounded-xl border border-[#1e1e38] gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white font-bold text-sm">
                          ${Number(w.amount).toFixed(2)}
                        </p>
                        <span className="text-gray-500 text-xs">
                          {w.network}
                        </span>
                        <span className={statusBadge(w.status)}>
                          {w.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-[10px] font-mono truncate">
                        To: {w.wallet_address}
                      </p>
                      <p className="text-gray-600 text-[10px] mt-0.5">
                        User: {w.profiles?.full_name || w.user_id} ·{" "}
                        {new Date(w.created_at).toLocaleString()}
                      </p>
                    </div>
                    {w.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() =>
                            doAction(
                              {
                                target_table: "apex_withdrawals",
                                target_id: w.id,
                                target_status: "approved",
                              },
                              w.id + "-approve",
                            )
                          }
                          disabled={actionLoading === w.id + "-approve"}
                          className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-1.5 rounded font-bold uppercase text-[10px] tracking-wider disabled:opacity-50 transition"
                        >
                          {actionLoading === w.id + "-approve"
                            ? "..."
                            : "Mark Processed"}
                        </button>
                        <button
                          onClick={() =>
                            doAction(
                              {
                                target_table: "apex_withdrawals",
                                target_id: w.id,
                                target_status: "rejected",
                              },
                              w.id + "-reject",
                            )
                          }
                          disabled={actionLoading === w.id + "-reject"}
                          className="bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-900/40 px-4 py-1.5 rounded font-bold uppercase text-[10px] tracking-wider disabled:opacity-50 transition"
                        >
                          Reject & Refund
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* LOANS TAB */}
        {activeTab === "loans" && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              Loan Requests
            </h2>
            {data.loans.length === 0 ? (
              <p className="text-gray-600 text-xs italic">No loan requests.</p>
            ) : (
              <div className="space-y-2">
                {data.loans.map((loan: any) => (
                  <div
                    key={loan.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0b0b18] p-4 rounded-xl border border-[#1e1e38] gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white font-bold text-sm">
                          ${Number(loan.loan_principal).toFixed(2)}
                        </p>
                        <span className={statusBadge(loan.status)}>
                          {loan.status}
                        </span>
                      </div>
                      {loan.total_due && (
                        <p className="text-gray-500 text-[10px]">
                          Total Due: ${Number(loan.total_due).toFixed(2)} ·
                          Rate: {loan.interest_rate_annual}% p.a.
                        </p>
                      )}
                      <p className="text-gray-600 text-[10px] mt-0.5">
                        User: {loan.profiles?.full_name || loan.user_id} ·{" "}
                        {new Date(loan.created_at).toLocaleString()}
                      </p>
                    </div>
                    {loan.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() =>
                            doAction(
                              {
                                target_table: "apex_loans",
                                target_id: loan.id,
                                target_status: "approved",
                              },
                              loan.id + "-approve",
                            )
                          }
                          disabled={actionLoading === loan.id + "-approve"}
                          className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-1.5 rounded font-bold uppercase text-[10px] tracking-wider disabled:opacity-50 transition"
                        >
                          {actionLoading === loan.id + "-approve"
                            ? "..."
                            : "Approve & Disburse"}
                        </button>
                        <button
                          onClick={() =>
                            doAction(
                              {
                                target_table: "apex_loans",
                                target_id: loan.id,
                                target_status: "rejected",
                              },
                              loan.id + "-reject",
                            )
                          }
                          disabled={actionLoading === loan.id + "-reject"}
                          className="bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-900/40 px-4 py-1.5 rounded font-bold uppercase text-[10px] tracking-wider disabled:opacity-50 transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              User Management
            </h2>
            {data.users.length === 0 ? (
              <p className="text-gray-600 text-xs italic">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#1e1e38] text-[10px] text-gray-500 uppercase tracking-widest">
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Role</th>
                      <th className="text-left py-3 px-2">KYC</th>
                      <th className="text-left py-3 px-2">Balance</th>
                      <th className="text-left py-3 px-2">Earnings</th>
                      <th className="text-left py-3 px-2">Joined</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((u: any) => (
                      <tr
                        key={u.user_id}
                        className="border-b border-[#1e1e38]/40 hover:bg-white/5"
                      >
                        <td className="py-3 px-2 text-white font-medium">
                          {u.full_name || "—"}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${u.user_role === "admin" ? "bg-red-900/30 text-red-400 border-red-800/40" : "bg-gray-900/30 text-gray-400 border-gray-700/40"}`}
                          >
                            {u.user_role || "user"}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={statusBadge(u.kyc_status || "pending")}
                          >
                            {u.kyc_status || "pending"}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-white font-mono">
                          $
                          {Number(
                            u.apex_wallets?.[0]?.available_balance || 0,
                          ).toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-[#00d1b2] font-mono">
                          $
                          {Number(
                            u.apex_wallets?.[0]?.total_earnings || 0,
                          ).toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-gray-500">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() =>
                              setCreditModal({
                                open: true,
                                userId: u.user_id,
                                userName: u.full_name || u.user_id,
                              })
                            }
                            className="bg-[#1e1e38] hover:bg-[#2a2a50] text-[#00d1b2] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition"
                          >
                            Credit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* INVESTMENTS TAB */}
        {activeTab === "investments" && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              All Investments
            </h2>
            {data.investments.length === 0 ? (
              <p className="text-gray-600 text-xs italic">
                No investments found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#1e1e38] text-[10px] text-gray-500 uppercase tracking-widest">
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Plan</th>
                      <th className="text-left py-3 px-2">Principal</th>
                      <th className="text-left py-3 px-2">APY</th>
                      <th className="text-left py-3 px-2">Progress</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.investments.map((inv: any) => (
                      <tr
                        key={inv.id}
                        className="border-b border-[#1e1e38]/40 hover:bg-white/5"
                      >
                        <td className="py-3 px-2 text-gray-400">
                          {inv.profiles?.full_name ||
                            inv.user_id?.slice(0, 8) + "..."}
                        </td>
                        <td className="py-3 px-2 text-white font-medium">
                          {inv.plan_name}
                        </td>
                        <td className="py-3 px-2 text-white font-mono">
                          ${Number(inv.amount_invested).toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-[#00d1b2]">
                          {(Number(inv.apy_percentage) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-gray-400">
                          {inv.weeks_elapsed || 0}/
                          {inv.lock_duration_weeks || 52} wks
                        </td>
                        <td className="py-3 px-2">
                          <span className={statusBadge(inv.status)}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-500">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-400">
              Transaction Ledger
            </h2>
            {data.transactions.length === 0 ? (
              <p className="text-gray-600 text-xs italic">
                No transactions found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#1e1e38] text-[10px] text-gray-500 uppercase tracking-widest">
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Type</th>
                      <th className="text-left py-3 px-2">Gross</th>
                      <th className="text-left py-3 px-2">Net</th>
                      <th className="text-left py-3 px-2">Fee</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Description</th>
                      <th className="text-left py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((txn: any) => {
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
                          <td className="py-3 px-2 text-gray-400">
                            {txn.profiles?.full_name ||
                              txn.user_id?.slice(0, 8) + "..."}
                          </td>
                          <td className="py-3 px-2 text-white uppercase tracking-wide">
                            {txn.type}
                          </td>
                          <td
                            className={`py-3 px-2 font-mono font-bold ${isCredit ? "text-[#00d1b2]" : "text-gray-400"}`}
                          >
                            {isCredit ? "+" : "-"}$
                            {Number(
                              txn.gross_amount || txn.amount || 0,
                            ).toFixed(2)}
                          </td>
                          <td className="py-3 px-2 font-mono text-gray-300">
                            $
                            {Number(txn.net_amount || txn.amount || 0).toFixed(
                              2,
                            )}
                          </td>
                          <td className="py-3 px-2 font-mono text-gray-500">
                            ${Number(txn.platform_fee || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={statusBadge(txn.status || "completed")}
                            >
                              {txn.status || "completed"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-gray-500 max-w-xs truncate">
                            {txn.description || "—"}
                          </td>
                          <td className="py-3 px-2 text-gray-500">
                            {new Date(txn.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>

      {/* CREDIT MODAL */}
      {creditModal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider">
              Manual Balance Credit
            </h3>
            <p className="text-gray-400 text-xs">
              User:{" "}
              <span className="text-white font-mono">
                {creditModal.userName}
              </span>
            </p>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1 tracking-wider">
                Credit Amount ($)
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-2.5 text-sm text-white"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreditSubmit}
                className="flex-1 py-2.5 bg-[#00d1b2] text-[#060613] rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Apply Credit
              </button>
              <button
                onClick={() => {
                  setCreditModal({ open: false, userId: "", userName: "" });
                  setCreditAmount("");
                }}
                className="flex-1 py-2.5 border border-[#1e1e38] text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:border-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
