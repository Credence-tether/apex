/**
 * Apex Asset Management — Email System
 * Powered by Resend · support@apxfund.xyz
 *
 * Usage:
 *   import { sendWelcomeEmail, sendDepositApprovedEmail } from "@/emails";
 */

import { Resend } from "resend";
import {
  welcomeEmail,
  kycSubmittedEmail,
  kycApprovedEmail,
  kycRejectedEmail,
  depositSubmittedEmail,
  depositApprovedEmail,
  investmentConfirmedEmail,
  withdrawalSubmittedEmail,
  withdrawalApprovedEmail,
  creditLineSubmittedEmail,
  creditLineApprovedEmail,
  weeklyRoiEmail,
  contactAutoReplyEmail,
  adminAlertEmail,
} from "./templates/templates";

const getResend = () => new Resend(process.env.RESEND_API_KEY);

const FROM = "Apex Asset Management <support@apxfund.xyz>";
const ADMIN = process.env.ADMIN_EMAIL || "support@apxfund.xyz";

function fmt(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function fmtDate(date?: Date): string {
  return (date || new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function genRef(prefix: string): string {
  return `${prefix}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

// ─────────────────────────────────────────────────────────
// 1. WELCOME
// ─────────────────────────────────────────────────────────
export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Welcome to Apex Asset Management, ${name}`,
    html: welcomeEmail({ name }),
  });
}

// ─────────────────────────────────────────────────────────
// 2. KYC SUBMITTED
// ─────────────────────────────────────────────────────────
export async function sendKycSubmittedEmail({
  to,
  name,
  documentType = "Government ID",
}: {
  to: string;
  name: string;
  documentType?: string;
}) {
  const submissionId = genRef("KYC");
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "KYC Documents Received — Under Review",
    html: kycSubmittedEmail({
      name,
      submissionId,
      documentType,
      submittedAt: fmtDate(),
    }),
  });
}

// ─────────────────────────────────────────────────────────
// 3. KYC APPROVED
// ─────────────────────────────────────────────────────────
export async function sendKycApprovedEmail({
  to,
  name,
  submissionId,
}: {
  to: string;
  name: string;
  submissionId?: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "✅ KYC Approved — Your Account is Fully Verified",
    html: kycApprovedEmail({
      name,
      submissionId: submissionId || genRef("KYC"),
      approvedAt: fmtDate(),
    }),
  });
}

// ─────────────────────────────────────────────────────────
// 4. KYC REJECTED
// ─────────────────────────────────────────────────────────
export async function sendKycRejectedEmail({
  to,
  name,
  reason,
  submissionId,
}: {
  to: string;
  name: string;
  reason: string;
  submissionId?: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Action Required — KYC Verification Could Not Be Completed",
    html: kycRejectedEmail({
      name,
      submissionId: submissionId || genRef("KYC"),
      reason,
    }),
  });
}

// ─────────────────────────────────────────────────────────
// 5. DEPOSIT SUBMITTED
// ─────────────────────────────────────────────────────────
export async function sendDepositSubmittedEmail({
  to,
  name,
  amount,
  method = "USDT (TRC20)",
}: {
  to: string;
  name: string;
  amount: number;
  method?: string;
}) {
  const reference = genRef("DEP");
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Deposit of ${fmt(amount)} Received — Pending Confirmation`,
    html: depositSubmittedEmail({
      name,
      amount: fmt(amount),
      method,
      reference,
      submittedAt: fmtDate(),
    }),
  });
  // Admin alert
  await sendAdminAlert({
    eventType: "Deposit Request",
    userName: name,
    userEmail: to,
    details: [
      { label: "Amount", value: fmt(amount), green: true },
      { label: "Method", value: method },
    ],
    reference,
  });
  return reference;
}

// ─────────────────────────────────────────────────────────
// 6. DEPOSIT APPROVED
// ─────────────────────────────────────────────────────────
export async function sendDepositApprovedEmail({
  to,
  name,
  amount,
  newBalance,
  reference,
}: {
  to: string;
  name: string;
  amount: number;
  newBalance: number;
  reference?: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `✅ ${fmt(amount)} Credited — Your Deposit is Confirmed`,
    html: depositApprovedEmail({
      name,
      amount: fmt(amount),
      newBalance: fmt(newBalance),
      reference: reference || genRef("DEP"),
      approvedAt: fmtDate(),
    }),
  });
}

// ─────────────────────────────────────────────────────────
// 7. INVESTMENT CONFIRMED
// ─────────────────────────────────────────────────────────
export async function sendInvestmentConfirmedEmail({
  to,
  name,
  principal,
  apy,
  tier,
}: {
  to: string;
  name: string;
  principal: number;
  apy: number; // e.g. 11.4
  tier: string;
}) {
  const weeklyYield = fmt((principal * (apy / 100)) / 52);
  const annualProjection = fmt(principal * (apy / 100));
  const investmentId = genRef("INV");

  const nextFriday = new Date();
  nextFriday.setDate(nextFriday.getDate() + ((5 - nextFriday.getDay() + 7) % 7 || 7));

  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Investment Active — Earning ${apy}% APY`,
    html: investmentConfirmedEmail({
      name,
      principal: fmt(principal),
      apy: `${apy}%`,
      weeklyYield,
      annualProjection,
      tier,
      investmentId,
      firstPayoutDate: fmtDate(nextFriday),
    }),
  });
}

// ─────────────────────────────────────────────────────────
// 8. WITHDRAWAL SUBMITTED
// ─────────────────────────────────────────────────────────
export async function sendWithdrawalSubmittedEmail({
  to,
  name,
  amount,
  network = "TRC20",
  walletAddress,
}: {
  to: string;
  name: string;
  amount: number;
  network?: string;
  walletAddress: string;
}) {
  const reference = genRef("WDR");
  const truncated = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Withdrawal of ${fmt(amount)} Submitted — Processing`,
    html: withdrawalSubmittedEmail({
      name,
      amount: fmt(amount),
      network,
      walletAddress: truncated,
      reference,
      submittedAt: fmtDate(),
    }),
  });
  // Admin alert
  await sendAdminAlert({
    eventType: "Withdrawal Request",
    userName: name,
    userEmail: to,
    details: [
      { label: "Amount", value: fmt(amount), green: true },
      { label: "Network", value: network },
      { label: "Wallet", value: truncated },
    ],
    reference,
  });
  return reference;
}

// ─────────────────────────────────────────────────────────
// 9. WITHDRAWAL APPROVED
// ─────────────────────────────────────────────────────────
export async function sendWithdrawalApprovedEmail({
  to,
  name,
  amount,
  network = "TRC20",
  txHash,
  reference,
}: {
  to: string;
  name: string;
  amount: number;
  network?: string;
  txHash: string;
  reference?: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `💸 Payout Sent — ${fmt(amount)} Dispatched to Your Wallet`,
    html: withdrawalApprovedEmail({
      name,
      amount: fmt(amount),
      network,
      txHash,
      reference: reference || genRef("WDR"),
      processedAt: fmtDate(),
    }),
  });
}

// ─────────────────────────────────────────────────────────
// 10. CREDIT LINE SUBMITTED
// ─────────────────────────────────────────────────────────
export async function sendCreditLineSubmittedEmail({
  to,
  name,
  requested,
  collateral,
}: {
  to: string;
  name: string;
  requested: number;
  collateral: number;
}) {
  const applicationId = genRef("LN");
  const ltv = Math.round((requested / collateral) * 100);

  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Credit Line Application Received — Under Review",
    html: creditLineSubmittedEmail({
      name,
      requested: fmt(requested),
      collateral: fmt(collateral),
      ltv: `${ltv}%`,
      rate: "4.5%",
      applicationId,
      submittedAt: fmtDate(),
    }),
  });
  await sendAdminAlert({
    eventType: "Credit Line Request",
    userName: name,
    userEmail: to,
    details: [
      { label: "Requested", value: fmt(requested), green: true },
      { label: "Collateral", value: fmt(collateral) },
      { label: "LTV", value: `${ltv}%` },
    ],
    reference: applicationId,
  });
  return applicationId;
}

// ─────────────────────────────────────────────────────────
// 11. CREDIT LINE APPROVED
// ─────────────────────────────────────────────────────────
export async function sendCreditLineApprovedEmail({
  to,
  name,
  amount,
  applicationId,
}: {
  to: string;
  name: string;
  amount: number;
  applicationId?: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `✅ Credit Line Approved — ${fmt(amount)} Disbursed`,
    html: creditLineApprovedEmail({
      name,
      amount: fmt(amount),
      applicationId: applicationId || genRef("LN"),
      approvedAt: fmtDate(),
    }),
  });
}

// ─────────────────────────────────────────────────────────
// 12. WEEKLY ROI (called by pg_cron job)
// ─────────────────────────────────────────────────────────
export async function sendWeeklyRoiEmail({
  to,
  name,
  investments,
  portfolioValue,
}: {
  to: string;
  name: string;
  investments: { label: string; apy: string; principal: number; earned: number }[];
  portfolioValue: number;
}) {
  const totalEarned = investments.reduce((s, i) => s + i.earned, 0);
  const totalPrincipal = investments.reduce((s, i) => s + i.principal, 0);
  const now = new Date();
  const weekNum = Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);

  const nextFriday = new Date();
  nextFriday.setDate(nextFriday.getDate() + ((5 - nextFriday.getDay() + 7) % 7 || 7));

  return getResend().emails.send({
    from: FROM,
    to,
    subject: `📈 Your Weekly Earnings — ${fmt(totalEarned)} Distributed`,
    html: weeklyRoiEmail({
      name,
      weekLabel: `Week ${weekNum}`,
      weekEnding: fmtDate(),
      investments: investments.map((i) => ({
        label: i.label,
        apy: i.apy,
        principal: fmt(i.principal),
        earned: `+${fmt(i.earned)}`,
      })),
      totalPrincipal: fmt(totalPrincipal),
      totalEarned: `+${fmt(totalEarned)}`,
      portfolioValue: fmt(portfolioValue),
      nextPayoutDate: fmtDate(nextFriday),
    }),
  });
}

// ─────────────────────────────────────────────────────────
// 13. CONTACT AUTO-REPLY
// ─────────────────────────────────────────────────────────
export async function sendContactAutoReply({
  to,
  name,
  subject,
}: {
  to: string;
  name: string;
  subject: string;
}) {
  const ticketId = genRef("TKT");
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `We received your message — Ticket #${ticketId}`,
    html: contactAutoReplyEmail({
      name,
      subject,
      ticketId,
      submittedAt: fmtDate(),
    }),
  });
  // Admin notification
  await sendAdminAlert({
    eventType: "Contact Form Submission",
    userName: name,
    userEmail: to,
    details: [{ label: "Subject", value: subject }],
    reference: ticketId,
  });
  return ticketId;
}

// ─────────────────────────────────────────────────────────
// 14. ADMIN ALERT (internal — called by other functions)
// ─────────────────────────────────────────────────────────
export async function sendAdminAlert({
  eventType,
  userName,
  userEmail,
  details,
  reference,
  adminUrl,
}: {
  eventType: string;
  userName: string;
  userEmail: string;
  details: { label: string; value: string; green?: boolean }[];
  reference: string;
  adminUrl?: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to: ADMIN,
    subject: `[APEX ADMIN] New ${eventType} — ${reference}`,
    html: adminAlertEmail({
      eventType,
      userName,
      userEmail,
      details,
      reference,
      timestamp: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
      adminUrl,
    }),
  });
}
