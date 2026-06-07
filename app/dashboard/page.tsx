"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { useLocale } from "../../lib/locale-context";

// ── Animated number hook ──────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setVal(0);
      return;
    }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

// ── Sparkline SVG ─────────────────────────────────────────────
function Sparkline({
  data,
  color = "#00d1b2",
}: {
  data: number[];
  color?: string;
}) {
  if (!data || data.length < 2) return null;
  const w = 300;
  const h = 60;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map(
      (v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`,
    )
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height: 60, opacity: 0.5 }}
    >
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2" points={pts} />
      <polygon fill="url(#sg)" points={`0,${h} ${pts} ${w},${h}`} />
    </svg>
  );
}

// ── Skeleton block ────────────────────────────────────────────
function Skeleton({
  h = 16,
  w = "100%",
  r = 8,
}: {
  h?: number;
  w?: string | number;
  r?: number;
}) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: r,
        background:
          "linear-gradient(90deg,#151a23 25%,#1e2535 50%,#151a23 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

// ── Asset icons ───────────────────────────────────────────────
const ASSET_COLORS: Record<string, string> = {
  BTC: "#f7931a",
  ETH: "#627eea",
  USDT: "#26a17b",
  USDC: "#2775ca",
};
const ASSET_ICONS: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  USDT: "₮",
  USDC: "$",
};

const STATUS_DOT: Record<string, string> = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  active: "#3b82f6",
  completed: "#00d1b2",
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { locale } = useLocale();
  const de = locale === "de";

  const T = {
    loading: de ? "Wird geladen..." : "Loading...",
    signOut: de ? "Abmelden" : "Sign Out",
    totalBalance: de ? "Gesamtguthaben" : "Total Balance",
    locked: de ? "Gesperrt" : "Locked",
    earnings: de ? "Ertrag" : "Earnings",
    deposit: de ? "Einzahlen" : "Deposit",
    invest: de ? "Investieren" : "Invest",
    withdraw: de ? "Auszahlen" : "Withdraw",
    loans: de ? "Kredit" : "Credit",
    home: de ? "Start" : "Home",
    assets: de ? "Assets" : "Assets",
    profile: de ? "Profil" : "Profile",
    recentActivity: de ? "Letzte Aktivitäten" : "Recent Activity",
    noActivity: de ? "Noch keine Aktivitäten." : "No activity yet.",
    myInvestments: de ? "Meine Investitionen" : "My Investments",
    noInvestments: de ? "Noch keine Investitionen." : "No investments yet.",
    myProfile: de ? "Mein Profil" : "My Profile",
    kycStatus: de ? "KYC-Status" : "KYC Status",
    kycVerified: de ? "Verifiziert" : "Verified",
    kycPending: de ? "Ausstehend" : "Pending",
    submitKyc: de ? "KYC einreichen" : "Submit KYC",
    resubmitKyc: de ? "Erneut einreichen" : "Resubmit KYC",
    adminPanel: de ? "Admin-Panel" : "Admin Panel",
    fundAcct: de ? "Konto aufladen" : "Fund Account",
    selectAsset: de ? "Asset wählen" : "Select Asset",
    depositAddr: de ? "Einzahlungsadresse" : "Deposit Address",
    copy: de ? "Kopieren" : "Copy",
    copied: de ? "✓ Kopiert" : "✓ Copied",
    amountUsd: de ? "Betrag (USD)" : "Amount (USD)",
    txHashLabel: de ? "Transaktions-Hash" : "Transaction Hash",
    txHashPh: de ? "Hash hier einfügen" : "Paste tx hash here",
    txHashHint: de
      ? "Erst überweisen, dann Hash einfügen."
      : "Transfer first, then paste the hash.",
    submitDeposit: de ? "Einzahlung bestätigen" : "Confirm Deposit",
    initInvest: de ? "Investition starten" : "Start Investment",
    plan: de ? "Plan" : "Plan",
    principal: de ? "Kapitalbetrag ($)" : "Principal ($)",
    estWeekly: de ? "Wöchentl. Rendite" : "Weekly Yield",
    estAnnual: de ? "Jahresrendite" : "Annual Yield",
    deploy: de ? "Deployen" : "Deploy",
    deploying: de ? "Wird deployed..." : "Deploying...",
    submitting: de ? "Wird eingereicht..." : "Submitting...",
    processing: de ? "Wird verarbeitet..." : "Processing...",
    outward: de ? "Auszahlung" : "Withdrawal",
    available: de ? "Verfügbar" : "Available",
    destWallet: de ? "Ziel-Wallet" : "Destination Wallet",
    walletPh: de ? "Wallet-Adresse einfügen" : "Paste wallet address",
    network: de ? "Netzwerk" : "Network",
    execWithdraw: de ? "Auszahlung ausführen" : "Execute Withdrawal",
    creditLine: de ? "Kreditlinie" : "Credit Line",
    ltvInfo: de ? "Max. 50% LTV · 4,5% Zinssatz" : "Max 50% LTV · 4.5% Rate",
    maxCredit: de ? "Max. Kreditlinie" : "Max Credit",
    requestCredit: de ? "Kreditlinie beantragen" : "Request Credit Line",
    kycModal: de ? "KYC-Verifizierung" : "KYC Verification",
    kycModalDesc: de
      ? "Dokumente für manuelle Prüfung einreichen."
      : "Submit documents for manual review.",
    docType: de ? "Dokumententyp" : "Document Type",
    docNumber: de ? "Dokumentennummer" : "Document Number",
    docNumberPh: de ? "Nummer eingeben" : "Enter number",
    docFile: de ? "Dokumentendatei" : "Document File",
    selfie: de ? "Selfie (Optional)" : "Selfie (Optional)",
    sendKyc: de ? "KYC senden" : "Send KYC",
    cancel: de ? "Abbrechen" : "Cancel",
    close: de ? "Schließen" : "Close",
    networkError: de ? "Netzwerkfehler." : "Network error.",
    minAlloc: de ? "Mindestanlage: $300." : "Minimum allocation: $300.",
    fillDeposit: de ? "Alle Felder ausfüllen." : "Fill all deposit fields.",
    fillWithdraw: de
      ? "Betrag und Adresse angeben."
      : "Provide amount and address.",
    fillLoan: de ? "Gültigen Betrag angeben." : "Provide a valid amount.",
    fillKyc: de
      ? "Nummer und Datei erforderlich."
      : "Number and file required.",
    weeks: de ? "Wo." : "wks",
  };

  type Tab =
    | "home"
    | "assets"
    | "deposit"
    | "invest"
    | "withdraw"
    | "loans"
    | "profile";
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("home");
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
  const [showPlanModal, setShowPlanModal] = useState<string | null>(null);
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycIdType, setKycIdType] = useState("Passport");
  const [kycIdNumber, setKycIdNumber] = useState("");
  const [kycDocumentFile, setKycDocumentFile] = useState<File | null>(null);
  const [kycSelfieFile, setKycSelfieFile] = useState<File | null>(null);
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: "", isError: false });
  const [sparkData] = useState(() =>
    Array.from(
      { length: 14 },
      (_, i) => 800 + Math.sin(i * 0.7) * 200 + Math.random() * 150,
    ),
  );

  const depositWallets: Record<string, string> = {
    USDT: "0x742d35Cc6634C0532925a3b844Bc152e1B3f4e6B",
    USDC: "0x8BA34fd6aC8D3fA6ab4ad64c0c9Cf4df9e4C28B9",
    BTC: "3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy",
    ETH: "0x9876543210ABCDEFabcdef1234567890abcdef12",
  };

  const planOptions = [
    {
      label: de ? "Einstiegsplan (5,2 %)" : "Stable-Tier Entry (5.2%)",
      apy: "0.052",
    },
    {
      label: de ? "Wachstumsplan (7,8 %)" : "Amateur Growth (7.8%)",
      apy: "0.078",
    },
    {
      label: de ? "Apex Wachstum (11,4 %)" : "Apex Thrive (11.4%)",
      apy: "0.114",
    },
    {
      label: de ? "Institutionell (15,6 %)" : "Institutional (15.6%)",
      apy: "0.156",
    },
  ];


  const PLAN_INFO: Record<string, {name:string;apy:string;minDeposit:string;lockPeriod:string;withdrawal:string;payoutSchedule:string;creditLine:string;ideal:string;terms:string[]}> = {
    "0.052":{name:"Stable-Tier Entry",apy:"5.2% APY",minDeposit:"$300",lockPeriod:"No lock-in period",withdrawal:"Withdraw anytime after 7 days. Processed within 24–72 hours.",payoutSchedule:"Weekly — every Friday",creditLine:"Not available on this tier",ideal:"First-time investors seeking stable, low-risk digital yield.",terms:["Minimum investment: $300","No lock-in — withdraw after 7 days","Weekly yield every Friday","Early withdrawal before 7 days forfeits that week's earnings","APY fixed at 5.2%","Reinvestment available anytime"]},
    "0.078":{name:"Amateur Growth",apy:"7.8% APY",minDeposit:"$300",lockPeriod:"14-day soft lock",withdrawal:"Withdraw after 14 days. Processed within 24–72 hours.",payoutSchedule:"Weekly — every Friday",creditLine:"50% LTV credit line eligible after 30 days",ideal:"Investors wanting consistent growth with credit-backed liquidity.",terms:["Minimum investment: $300","14-day soft lock from investment date","Weekly yield every Friday","Early exit before 14 days incurs 1.5% fee","APY fixed at 7.8%","Credit line after 30 days at 50% LTV, 4.5% origination rate","Collateral earns yield while credit line is active"]},
    "0.114":{name:"Apex Thrive",apy:"11.4% APY",minDeposit:"$1,000",lockPeriod:"30-day soft lock",withdrawal:"Withdraw after 30 days. Priority processing within 24 hours.",payoutSchedule:"Weekly — every Friday",creditLine:"50% LTV credit line after 14 days",ideal:"Growth-focused investors seeking high yield with institutional credit access.",terms:["Minimum investment: $1,000","30-day soft lock from investment date","Weekly yield every Friday","Early exit before 30 days incurs 2.5% fee","APY fixed at 11.4%","Credit line after 14 days at 50% LTV","Priority 24-hour withdrawal processing","Collateral earns yield while credit line is active"]},
    "0.156":{name:"Institutional",apy:"15.6% APY",minDeposit:"$5,000",lockPeriod:"60-day soft lock",withdrawal:"Withdraw after 60 days. Priority 24-hour processing.",payoutSchedule:"Weekly — every Friday",creditLine:"Immediate 50% LTV credit line upon investment",ideal:"High-net-worth investors seeking maximum yield with premium liquidity.",terms:["Minimum investment: $5,000","60-day soft lock from investment date","Weekly yield every Friday","Early exit before 60 days incurs 3.5% fee","APY fixed at 15.6%","Immediate credit line at 50% LTV","Priority 24-hour withdrawals","Dedicated account manager","Collateral earns yield while credit line is active"]},
  };
  const balance = Number(profile?.balance || 0);
  const lockedCollateral = Number(profile?.locked_collateral || 0);
  const totalEarnings = Number(profile?.total_earnings || 0);
  const animBalance = useCountUp(balance);
  const animLocked = useCountUp(lockedCollateral);
  const animEarnings = useCountUp(totalEarnings);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      const [
        { data: prof },
        { data: inv },
        { data: dep },
        { data: loan },
        { data: kyc },
        { data: txn },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).single(),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", u.id)
          .eq("request_type", "investment_purchase")
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", u.id)
          .eq("request_type", "deposit")
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", u.id)
          .eq("request_type", "loan_request")
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", u.id)
          .eq("request_type", "kyc_submission")
          .order("created_at", { ascending: false }),
        supabase
          .from("apex_master_requests")
          .select("*")
          .eq("user_id", u.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (prof) setProfile(prof);
      setInvestments(
        (inv || []).map((r: any) => ({
          ...r,
          plan_name: r.meta_data?.plan_name || "",
          amount_invested: r.amount,
          apy_percentage: r.meta_data?.apy_percentage || 0,
          lock_duration_weeks: r.meta_data?.lock_duration_weeks || 52,
          weeks_elapsed: r.meta_data?.weeks_elapsed || 0,
        })),
      );
      setDeposits(
        (dep || []).map((r: any) => ({
          ...r,
          asset_ticker: r.meta_data?.asset_ticker || "USDT",
          transaction_hash: r.meta_data?.transaction_hash || "",
        })),
      );
      setLoans(
        (loan || []).map((r: any) => ({
          ...r,
          total_due: r.meta_data?.total_due,
        })),
      );
      setKycRequests(
        (kyc || []).map((r: any) => ({
          ...r,
          id_type: r.meta_data?.id_type || "",
        })),
      );
      setTransactions(txn || []);
    } catch (e: any) {
      showMsg(e.message, true);
    } finally {
      setLoading(false);
    }
  }

  function showMsg(text: string, isError = false) {
    setMsg({ text, isError });
    setTimeout(() => setMsg({ text: "", isError: false }), 5000);
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
        fetchData();
        return true;
      }
      showMsg(data.error, true);
      return false;
    } catch {
      showMsg(T.networkError, true);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0 || !txHash.trim()) {
      showMsg(T.fillDeposit, true);
      return;
    }
    const ok = await post("/api/deposit", {
      amount: depositAmount,
      asset_ticker: depositAsset,
      transaction_hash: txHash,
    });
    if (ok) {
      setDepositAmount("");
      setTxHash("");
    }
  }

  async function handleInvestment(e: React.FormEvent) {
    e.preventDefault();
    if (!investAmount || parseFloat(investAmount) < 300) {
      showMsg(T.minAlloc, true);
      return;
    }
    const ok = await post("/api/invest", {
      plan_name: investPlan,
      amount: investAmount,
      apy: investApy,
    });
    if (ok) setInvestAmount("");
  }

  async function handleWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    if (
      !withdrawAmount ||
      parseFloat(withdrawAmount) <= 0 ||
      !withdrawAddress
    ) {
      showMsg(T.fillWithdraw, true);
      return;
    }
    const ok = await post("/api/withdraw", {
      amount: withdrawAmount,
      wallet_address: withdrawAddress,
      network: withdrawNetwork,
    });
    if (ok) {
      setWithdrawAmount("");
      setWithdrawAddress("");
    }
  }

  async function handleLoan(e: React.FormEvent) {
    e.preventDefault();
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      showMsg(T.fillLoan, true);
      return;
    }
    const ok = await post("/api/loan", { amount: loanAmount });
    if (ok) setLoanAmount("");
  }

  async function handleKycSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!kycIdNumber.trim() || !kycDocumentFile) {
      showMsg(T.fillKyc, true);
      return;
    }
    setKycSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("id_type", kycIdType);
      fd.append("id_number", kycIdNumber);
      fd.append("document", kycDocumentFile);
      if (kycSelfieFile) fd.append("selfie", kycSelfieFile);
      fd.append("full_name", profile?.full_name || user?.email || "");
      const res = await fetch("/api/kyc", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message || "KYC submitted");
        fetchData();
        setKycModalOpen(false);
        setKycIdNumber("");
        setKycDocumentFile(null);
        setKycSelfieFile(null);
      } else showMsg(data.error, true);
    } catch (e: any) {
      showMsg(e.message, true);
    } finally {
      setKycSubmitting(false);
    }
  }

  function copyToClipboard(addr: string, asset: string) {
    navigator.clipboard.writeText(addr);
    setCopiedAsset(asset);
    setTimeout(() => setCopiedAsset(null), 2000);
  }

  const inp =
    "w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all border-0 focus:ring-2 focus:ring-[#00d1b2]/40";
  const inpBg = { background: "#0b0e14" };
  const lbl = "block text-[10px] text-gray-500 uppercase tracking-widest mb-2";
  const cardBg = { background: "#151a23" };

  // ── Skeleton screen ───────────────────────────────────────
  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0e14",
          padding: "24px 16px",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Skeleton h={32} w={140} />
          <Skeleton h={160} r={20} />
          <div style={{ display: "flex", gap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} h={72} w="25%" r={16} />
            ))}
          </div>
          <Skeleton h={200} r={16} />
          <Skeleton h={80} r={16} />
          <Skeleton h={80} r={16} />
        </div>
      </div>
    );

  const allActivity = [...transactions].slice(0, 8);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0e14",
        fontFamily: "'DM Sans',sans-serif",
        paddingBottom: 80,
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .3s ease-out both}
        .action-btn:active{transform:scale(0.93)}
        .tile:active{background:#1a2130!important}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
      `}</style>

      {/* ── HERO ZONE ─────────────────────────────────────── */}
      {tab === "home" && (
        <div className="fade-up">
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 20px 0",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: "#4a5568",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {profile?.full_name?.split(" ")[0] ||
                  user?.email?.split("@")[0]}
              </p>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#e2e8f0",
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                APEX
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {msg.text && (
                <span
                  style={{
                    fontSize: 11,
                    padding: "6px 12px",
                    borderRadius: 20,
                    background: msg.isError
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(0,209,178,0.15)",
                    color: msg.isError ? "#f87171" : "#00d1b2",
                  }}
                >
                  {msg.text}
                </span>
              )}
              {profile?.role === "admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  style={{
                    fontSize: 11,
                    padding: "6px 12px",
                    borderRadius: 20,
                    background: "rgba(239,68,68,0.1)",
                    color: "#f87171",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {T.adminPanel}
                </button>
              )}
            </div>
          </div>

          {/* Balance card */}
          <div
            style={{
              margin: "16px 16px 0",
              borderRadius: 24,
              padding: "24px 24px 0",
              background:
                "linear-gradient(135deg,#0f1923 0%,#0a1628 60%,#0b1a1a 100%)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle,rgba(0,209,178,0.12) 0%,transparent 70%)",
              }}
            />
            <p
              style={{
                fontSize: 11,
                color: "#4a5a6a",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                marginBottom: 6,
              }}
            >
              {T.totalBalance}
            </p>
            <p
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: "#ffffff",
                fontFamily: "'Syne',sans-serif",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              ${animBalance.toFixed(2)}
            </p>
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 16,
                marginTop: 8,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: "#4a5a6a",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {T.locked}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#60a5fa" }}>
                  ${animLocked.toFixed(2)}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: "#4a5a6a",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {T.earnings}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#00d1b2" }}>
                  ${animEarnings.toFixed(2)}
                </p>
              </div>
            </div>
            <Sparkline data={sparkData} />
          </div>

          {/* KYC banner */}
          {profile && !profile.kyc_verified && (
            <div
              style={{
                margin: "12px 16px 0",
                borderRadius: 14,
                padding: "12px 16px",
                background: "rgba(245,158,11,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: 12, color: "#f59e0b" }}>
                {T.kycStatus}:{" "}
                <strong style={{ textTransform: "uppercase" }}>
                  {profile.kyc_status}
                </strong>
              </p>
              <button
                onClick={() => setKycModalOpen(true)}
                style={{
                  fontSize: 11,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "#f59e0b",
                  color: "#000",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {kycRequests[0]?.status === "rejected"
                  ? T.resubmitKyc
                  : T.submitKyc}
              </button>
            </div>
          )}

          {/* ── ACTION ZONE ───────────────────────────────── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "20px 16px 0",
              padding: "16px",
              borderRadius: 20,
              ...cardBg,
            }}
          >
            {[
              {
                icon: "↓",
                label: T.deposit,
                tab: "deposit" as Tab,
                color: "#00d1b2",
              },
              {
                icon: "📈",
                label: T.invest,
                tab: "invest" as Tab,
                color: "#60a5fa",
              },
              {
                icon: "↑",
                label: T.withdraw,
                tab: "withdraw" as Tab,
                color: "#f87171",
              },
              {
                icon: "🏦",
                label: T.loans,
                tab: "loans" as Tab,
                color: "#fbbf24",
              },
            ].map((a) => (
              <button
                key={a.tab}
                className="action-btn"
                onClick={() => setTab(a.tab)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: `${a.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  <span
                    style={{
                      color: a.color,
                      fontWeight: 700,
                      fontSize: a.icon.length === 1 ? 22 : 18,
                    }}
                  >
                    {a.icon}
                  </span>
                </div>
                <span
                  style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}
                >
                  {a.label}
                </span>
              </button>
            ))}
          </div>

          {/* ── ASSET LIST ────────────────────────────────── */}
          <div style={{ margin: "16px 16px 0" }}>
            <p
              style={{
                fontSize: 11,
                color: "#4a5568",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 12,
              }}
            >
              {T.recentActivity}
            </p>
            {allActivity.length === 0 ? (
              <div
                style={{
                  ...cardBg,
                  borderRadius: 16,
                  padding: "32px 16px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 13, color: "#4a5568" }}>{T.noActivity}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allActivity.map((txn) => {
                  const asset = txn.meta_data?.asset_ticker || "USDT";
                  const isCredit = ["deposit", "loan_request"].includes(
                    txn.request_type,
                  );
                  const typeLabel = (txn.request_type || "").replace(/_/g, " ");
                  const dotColor = STATUS_DOT[txn.status] || "#6b7280";
                  return (
                    <div
                      key={txn.id}
                      className="tile"
                      onClick={() => setTab("assets")}
                      style={{
                        ...cardBg,
                        borderRadius: 16,
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        cursor: "pointer",
                        transition: "background .15s",
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: `${ASSET_COLORS[asset] || "#334155"}22`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          fontWeight: 700,
                          color: ASSET_COLORS[asset] || "#94a3b8",
                          flexShrink: 0,
                        }}
                      >
                        {ASSET_ICONS[asset] || "◎"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#e2e8f0",
                            textTransform: "capitalize",
                            marginBottom: 2,
                          }}
                        >
                          {typeLabel}
                        </p>
                        <p style={{ fontSize: 11, color: "#4a5568" }}>
                          {new Date(txn.created_at).toLocaleDateString(
                            de ? "de-DE" : "en-US",
                          )}
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: isCredit ? "#00d1b2" : "#f87171",
                            marginBottom: 4,
                          }}
                        >
                          {isCredit ? "+" : "−"}$
                          {Number(txn.amount || 0).toFixed(2)}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            justifyContent: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: dotColor,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 10,
                              color: dotColor,
                              textTransform: "capitalize",
                            }}
                          >
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ASSETS TAB ───────────────────────────────────── */}
      {tab === "assets" && (
        <div className="fade-up" style={{ padding: "24px 16px 0" }}>
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 20,
            }}
          >
            {T.myInvestments}
          </p>
          {investments.length === 0 ? (
            <div
              style={{
                ...cardBg,
                borderRadius: 16,
                padding: 32,
                textAlign: "center",
              }}
            >
              <p style={{ color: "#4a5568", fontSize: 13 }}>
                {T.noInvestments}
              </p>
              <button
                onClick={() => setTab("invest")}
                style={{
                  marginTop: 16,
                  padding: "10px 24px",
                  borderRadius: 20,
                  background: "#00d1b2",
                  color: "#0b0e14",
                  fontWeight: 700,
                  fontSize: 13,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {T.invest} →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {investments.map((inv) => {
                const pct = Math.min(
                  100,
                  ((inv.weeks_elapsed || 0) / (inv.lock_duration_weeks || 52)) *
                    100,
                );
                const dotColor = STATUS_DOT[inv.status] || "#6b7280";
                return (
                  <div
                    key={inv.id}
                    style={{
                      ...cardBg,
                      borderRadius: 18,
                      padding: "18px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#e2e8f0",
                            marginBottom: 2,
                          }}
                        >
                          {inv.plan_name}
                        </p>
                        <p
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: "#00d1b2",
                            fontFamily: "'Syne',sans-serif",
                          }}
                        >
                          {(Number(inv.apy_percentage) * 100).toFixed(1)}% APY
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#ffffff",
                          }}
                        >
                          ${Number(inv.amount_invested).toFixed(2)}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            justifyContent: "flex-end",
                            marginTop: 4,
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: dotColor,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 10,
                              color: dotColor,
                              textTransform: "capitalize",
                            }}
                          >
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        background: "#0b0e14",
                        borderRadius: 99,
                        height: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: "linear-gradient(90deg,#00d1b2,#60a5fa)",
                          borderRadius: 99,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                    <p style={{ fontSize: 10, color: "#4a5568", marginTop: 6 }}>
                      {inv.weeks_elapsed || 0}/{inv.lock_duration_weeks || 52}{" "}
                      {T.weeks}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'Syne',sans-serif",
              margin: "24px 0 12px",
            }}
          >
            {T.recentActivity}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {transactions.slice(0, 20).map((txn) => {
              const asset = txn.meta_data?.asset_ticker || "USDT";
              const isCredit = ["deposit", "loan_request"].includes(
                txn.request_type,
              );
              const dotColor = STATUS_DOT[txn.status] || "#6b7280";
              return (
                <div
                  key={txn.id}
                  style={{
                    ...cardBg,
                    borderRadius: 14,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: `${ASSET_COLORS[asset] || "#334155"}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: ASSET_COLORS[asset] || "#94a3b8",
                      flexShrink: 0,
                    }}
                  >
                    {ASSET_ICONS[asset] || "◎"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#e2e8f0",
                        textTransform: "capitalize",
                      }}
                    >
                      {(txn.request_type || "").replace(/_/g, " ")}
                    </p>
                    <p style={{ fontSize: 10, color: "#4a5568" }}>
                      {new Date(txn.created_at).toLocaleDateString(
                        de ? "de-DE" : "en-US",
                      )}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isCredit ? "#00d1b2" : "#f87171",
                      }}
                    >
                      {isCredit ? "+" : "−"}$
                      {Number(txn.amount || 0).toFixed(2)}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        justifyContent: "flex-end",
                        marginTop: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: dotColor,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          color: dotColor,
                          textTransform: "capitalize",
                        }}
                      >
                        {txn.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DEPOSIT ──────────────────────────────────────── */}
      {tab === "deposit" && (
        <div className="fade-up" style={{ padding: "24px 16px 0" }}>
          <button
            onClick={() => setTab("home")}
            style={{
              fontSize: 13,
              color: "#00d1b2",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 16,
              padding: 0,
            }}
          >
            ← {T.home}
          </button>
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 20,
            }}
          >
            {T.fundAcct}
          </p>
          {msg.text && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 16px",
                borderRadius: 12,
                background: msg.isError
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(0,209,178,0.1)",
                color: msg.isError ? "#f87171" : "#00d1b2",
                fontSize: 13,
              }}
            >
              {msg.text}
            </div>
          )}
          <form
            onSubmit={handleDeposit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label className={lbl}>{T.selectAsset}</label>
              <div style={{ display: "flex", gap: 8 }}>
                {Object.keys(depositWallets).map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => setDepositAsset(asset)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all .15s",
                      background:
                        depositAsset === asset
                          ? ASSET_COLORS[asset] || "#00d1b2"
                          : "#151a23",
                      color: depositAsset === asset ? "#fff" : "#6b7280",
                    }}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={lbl}>{T.depositAddr}</label>
              <div
                style={{
                  ...cardBg,
                  borderRadius: 14,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <code
                  style={{
                    flex: 1,
                    fontSize: 10,
                    color: "#94a3b8",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                    lineHeight: 1.5,
                  }}
                >
                  {depositWallets[depositAsset]}
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(depositWallets[depositAsset], depositAsset)
                  }
                  style={{
                    flexShrink: 0,
                    padding: "8px 14px",
                    borderRadius: 10,
                    border: "none",
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: "pointer",
                    background:
                      copiedAsset === depositAsset ? "#00d1b2" : "#1e2535",
                    color: copiedAsset === depositAsset ? "#0b0e14" : "#94a3b8",
                  }}
                >
                  {copiedAsset === depositAsset ? T.copied : T.copy}
                </button>
              </div>
            </div>
            <div>
              <label className={lbl}>{T.amountUsd}</label>
              <input
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                className={inp}
                style={inpBg}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <div>
              <label className={lbl}>{T.txHashLabel}</label>
              <input
                type="text"
                placeholder={T.txHashPh}
                className={inp}
                style={{ ...inpBg, fontFamily: "monospace", fontSize: 11 }}
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
              <p style={{ fontSize: 10, color: "#4a5568", marginTop: 6 }}>
                {T.txHashHint}
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 16,
                border: "none",
                background: "#00d1b2",
                color: "#0b0e14",
                fontWeight: 800,
                fontSize: 14,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
                letterSpacing: "0.05em",
              }}
            >
              {submitting ? T.submitting : T.submitDeposit}
            </button>
          </form>
        </div>
      )}

      {/* ── INVEST ───────────────────────────────────────── */}
      {tab === "invest" && (
        <div className="fade-up" style={{ padding: "24px 16px 0" }}>
          <button
            onClick={() => setTab("home")}
            style={{
              fontSize: 13,
              color: "#00d1b2",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 16,
              padding: 0,
            }}
          >
            ← {T.home}
          </button>
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 20,
            }}
          >
            {T.initInvest}
          </p>
          {msg.text && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 16px",
                borderRadius: 12,
                background: msg.isError
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(0,209,178,0.1)",
                color: msg.isError ? "#f87171" : "#00d1b2",
                fontSize: 13,
              }}
            >
              {msg.text}
            </div>
          )}
          <form
            onSubmit={handleInvestment}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label className={lbl}>{T.plan}</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {planOptions.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setInvestPlan(p.label);
                      setInvestApy(p.apy);
                    }}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      transition: "all .15s",
                      background:
                        investApy === p.apy
                          ? "rgba(0,209,178,0.12)"
                          : "#151a23",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: investApy === p.apy ? "#e2e8f0" : "#6b7280",
                      }}
                    >
                      {p.label}
                    </span>
                    {investApy === p.apy && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#00d1b2",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={lbl}>{T.principal}</label>
              <input
                type="number"
                placeholder="Min $300"
                min="300"
                step="0.01"
                className={inp}
                style={inpBg}
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
              />
            </div>
            {investAmount && parseFloat(investAmount) >= 300 && (
              <div
                style={{
                  ...cardBg,
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  gap: 24,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#4a5568",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {T.estWeekly}
                  </p>
                  <p
                    style={{ fontSize: 16, fontWeight: 700, color: "#00d1b2" }}
                  >
                    $
                    {(
                      (parseFloat(investAmount) * parseFloat(investApy)) /
                      52
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#4a5568",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {T.estAnnual}
                  </p>
                  <p
                    style={{ fontSize: 16, fontWeight: 700, color: "#60a5fa" }}
                  >
                    $
                    {(parseFloat(investAmount) * parseFloat(investApy)).toFixed(
                      2,
                    )}
                  </p>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 16,
                border: "none",
                background: "#60a5fa",
                color: "#0b0e14",
                fontWeight: 800,
                fontSize: 14,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? T.deploying : T.deploy}
            </button>
          </form>
        </div>
      )}

      {/* ── WITHDRAW ─────────────────────────────────────── */}
      {tab === "withdraw" && (
        <div className="fade-up" style={{ padding: "24px 16px 0" }}>
          <button
            onClick={() => setTab("home")}
            style={{
              fontSize: 13,
              color: "#00d1b2",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 16,
              padding: 0,
            }}
          >
            ← {T.home}
          </button>
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 8,
            }}
          >
            {T.outward}
          </p>
          <div
            style={{
              ...cardBg,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#4a5568",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {T.available}
            </p>
            <p
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#ffffff",
                fontFamily: "'Syne',sans-serif",
              }}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
          {msg.text && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 16px",
                borderRadius: 12,
                background: msg.isError
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(0,209,178,0.1)",
                color: msg.isError ? "#f87171" : "#00d1b2",
                fontSize: 13,
              }}
            >
              {msg.text}
            </div>
          )}
          <form
            onSubmit={handleWithdrawal}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label className={lbl}>{T.destWallet}</label>
              <input
                type="text"
                placeholder={T.walletPh}
                className={inp}
                style={{ ...inpBg, fontFamily: "monospace", fontSize: 11 }}
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
              />
            </div>
            <div>
              <label className={lbl}>{T.network}</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["ERC20", "TRC20", "BSC"].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setWithdrawNetwork(n)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      background: withdrawNetwork === n ? "#f87171" : "#151a23",
                      color: withdrawNetwork === n ? "#fff" : "#6b7280",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={lbl}>{T.amountUsd}</label>
              <input
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                className={inp}
                style={inpBg}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 16,
                border: "none",
                background: "rgba(239,68,68,0.85)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? T.processing : T.execWithdraw}
            </button>
          </form>
        </div>
      )}

      {/* ── LOANS ────────────────────────────────────────── */}
      {tab === "loans" && (
        <div className="fade-up" style={{ padding: "24px 16px 0" }}>
          <button
            onClick={() => setTab("home")}
            style={{
              fontSize: 13,
              color: "#00d1b2",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 16,
              padding: 0,
            }}
          >
            ← {T.home}
          </button>
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 8,
            }}
          >
            {T.creditLine}
          </p>
          <div
            style={{
              ...cardBg,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 11, color: "#4a5568", marginBottom: 6 }}>
              {T.ltvInfo}
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: "#4a5568",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {T.available}
                </p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
                  ${balance.toFixed(2)}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: "#4a5568",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {T.maxCredit}
                </p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24" }}>
                  ${(balance / 2).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          {msg.text && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 16px",
                borderRadius: 12,
                background: msg.isError
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(0,209,178,0.1)",
                color: msg.isError ? "#f87171" : "#00d1b2",
                fontSize: 13,
              }}
            >
              {msg.text}
            </div>
          )}
          <form
            onSubmit={handleLoan}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label className={lbl}>{T.creditLine} ($)</label>
              <input
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                className={inp}
                style={inpBg}
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 16,
                border: "none",
                background: "#fbbf24",
                color: "#0b0e14",
                fontWeight: 800,
                fontSize: 14,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? T.submitting : T.requestCredit}
            </button>
          </form>
          {loans.length > 0 && (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {loans.map((loan) => {
                const dotColor = STATUS_DOT[loan.status] || "#6b7280";
                return (
                  <div
                    key={loan.id}
                    style={{
                      ...cardBg,
                      borderRadius: 14,
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}
                      >
                        ${Number(loan.amount).toFixed(2)}
                      </p>
                      {loan.total_due && (
                        <p style={{ fontSize: 11, color: "#6b7280" }}>
                          Due: ${Number(loan.total_due).toFixed(2)}
                        </p>
                      )}
                      <p style={{ fontSize: 10, color: "#4a5568" }}>
                        {new Date(loan.created_at).toLocaleDateString(
                          de ? "de-DE" : "en-US",
                        )}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: dotColor,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: dotColor,
                          textTransform: "capitalize",
                        }}
                      >
                        {loan.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PROFILE ──────────────────────────────────────── */}
      {tab === "profile" && (
        <div className="fade-up" style={{ padding: "24px 16px 0" }}>
          <p
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'Syne',sans-serif",
              marginBottom: 20,
            }}
          >
            {T.myProfile}
          </p>
          <div
            style={{
              ...cardBg,
              borderRadius: 20,
              padding: 20,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(0,209,178,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                marginBottom: 12,
              }}
            >
              {(profile?.full_name || user?.email || "?")[0].toUpperCase()}
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>
              {profile?.full_name || "—"}
            </p>
            <p style={{ fontSize: 13, color: "#4a5568" }}>{user?.email}</p>
          </div>
          <div
            style={{
              ...cardBg,
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 13, color: "#94a3b8" }}>{T.kycStatus}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: profile?.kyc_verified ? "#10b981" : "#f59e0b",
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: profile?.kyc_verified ? "#10b981" : "#f59e0b",
                }}
              >
                {profile?.kyc_verified ? T.kycVerified : T.kycPending}
              </span>
            </div>
          </div>
          {!profile?.kyc_verified && (
            <button
              onClick={() => setKycModalOpen(true)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "#f59e0b",
                color: "#000",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              {kycRequests[0]?.status === "rejected"
                ? T.resubmitKyc
                : T.submitKyc}
            </button>
          )}
          {profile?.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "rgba(239,68,68,0.15)",
                color: "#f87171",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              {T.adminPanel}
            </button>
          )}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              border: "none",
              background: "#151a23",
              color: "#6b7280",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {T.signOut}
          </button>
        </div>
      )}

      {/* ── BOTTOM NAV ───────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: "rgba(11,14,20,0.97)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid #151a23",
          display: "flex",
          zIndex: 100,
        }}
      >
        {[
          { key: "home" as Tab, icon: "⌂", label: T.home },
          { key: "assets" as Tab, icon: "◈", label: T.assets },
          { key: "deposit" as Tab, icon: "↓", label: T.deposit },
          { key: "invest" as Tab, icon: "📈", label: T.invest },
          { key: "profile" as Tab, icon: "○", label: T.profile },
        ].map((n) => (
          <button
            key={n.key}
            onClick={() => setTab(n.key)}
            style={{
              flex: 1,
              padding: "12px 0 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: 18,
                lineHeight: 1,
                filter: tab === n.key ? "none" : "grayscale(1) opacity(0.4)",
              }}
            >
              {n.icon}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: tab === n.key ? "#00d1b2" : "#4a5568",
              }}
            >
              {n.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── KYC MODAL ────────────────────────────────────── */}
      {kycModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#151a23",
              borderRadius: "24px 24px 0 0",
              padding: "24px 20px 40px",
              animation: "fadeUp .25s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>
                  {T.kycModal}
                </p>
                <p style={{ fontSize: 11, color: "#4a5568" }}>
                  {T.kycModalDesc}
                </p>
              </div>
              <button
                onClick={() => setKycModalOpen(false)}
                style={{
                  background: "#0b0e14",
                  border: "none",
                  color: "#6b7280",
                  fontSize: 18,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleKycSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div>
                <label className={lbl}>{T.docType}</label>
                <select
                  value={kycIdType}
                  onChange={(e) => setKycIdType(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#0b0e14",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 14px",
                    color: "#e2e8f0",
                    fontSize: 14,
                  }}
                >
                  <option value="Passport">
                    {de ? "Reisepass" : "Passport"}
                  </option>
                  <option value="Driver's License">
                    {de ? "Führerschein" : "Driver's License"}
                  </option>
                  <option value="National ID">
                    {de ? "Personalausweis" : "National ID"}
                  </option>
                  <option value="Other">{de ? "Sonstiges" : "Other"}</option>
                </select>
              </div>
              <div>
                <label className={lbl}>{T.docNumber}</label>
                <input
                  value={kycIdNumber}
                  onChange={(e) => setKycIdNumber(e.target.value)}
                  placeholder={T.docNumberPh}
                  style={{
                    width: "100%",
                    background: "#0b0e14",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 14px",
                    color: "#e2e8f0",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label className={lbl}>{T.docFile}</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setKycDocumentFile(e.target.files?.[0] || null)
                  }
                  style={{
                    width: "100%",
                    background: "#0b0e14",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 14px",
                    color: "#94a3b8",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
                {kycDocumentFile && (
                  <p style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>
                    ✓ {kycDocumentFile.name}
                  </p>
                )}
              </div>
              <div>
                <label className={lbl}>{T.selfie}</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setKycSelfieFile(e.target.files?.[0] || null)
                  }
                  style={{
                    width: "100%",
                    background: "#0b0e14",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 14px",
                    color: "#94a3b8",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
                {kycSelfieFile && (
                  <p style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>
                    ✓ {kycSelfieFile.name}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={kycSubmitting}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 14,
                    border: "none",
                    background: "#00d1b2",
                    color: "#0b0e14",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: kycSubmitting ? "not-allowed" : "pointer",
                    opacity: kycSubmitting ? 0.6 : 1,
                  }}
                >
                  {kycSubmitting ? T.submitting : T.sendKyc}
                </button>
                <button
                  type="button"
                  onClick={() => setKycModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 14,
                    border: "none",
                    background: "#0b0e14",
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {T.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}