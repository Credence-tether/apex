import {
  baseLayout,
  statGrid,
  refRow,
  alertBox,
  ctaButton,
  stepList,
  earningsTable,
  bodyText,
  divider,
  BRAND,
} from "./base";

// ─────────────────────────────────────────────
// 1. WELCOME EMAIL
// ─────────────────────────────────────────────
export function welcomeEmail({ name }: { name: string }): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your Apex account has been successfully created. Before you can start earning, complete the three steps below to unlock full platform access.")}
    ${stepList([
      {
        title: "Complete KYC Verification",
        body: "Upload your government-issued ID and proof of address. Verification typically takes 24–48 hours.",
      },
      {
        title: "Fund Your Account",
        body: "Deposit a minimum of $300 to begin earning. Funds reflect within 24 hours after admin confirmation.",
      },
      {
        title: "Select Your Yield Tier",
        body: "Choose from 5.2%, 7.8%, 11.4%, or 15.6% APY configurations and start generating weekly yield.",
      },
    ])}
    ${ctaButton("Go to My Dashboard →", BRAND.dashboard)}
    ${alertBox(
      `<strong>Security notice:</strong> Apex will never ask for your password via email. If you did not create this account, contact us immediately at <a href="mailto:${BRAND.sender}" style="color:#00c9b1;">${BRAND.sender}</a>`,
      "info"
    )}
  `;
  return baseLayout({
    badge: "WELCOME",
    heroLabel: "Account Activated",
    heroTitle: `Welcome to <strong style="color:#00c9b1;">Apex Asset Management</strong>`,
    heroSubtitle:
      "Your account is live. You're now part of an institutional-grade digital yield platform — built for serious investors.",
    body,
    footerNote: "You're receiving this because you created an Apex account.",
  });
}

// ─────────────────────────────────────────────
// 2. KYC SUBMITTED
// ─────────────────────────────────────────────
export function kycSubmittedEmail({
  name,
  submissionId,
  documentType,
  submittedAt,
}: {
  name: string;
  submissionId: string;
  documentType: string;
  submittedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your identity verification documents have been received. Our compliance team will review your submission within 24–48 hours.")}
    ${refRow("Submission ID", submissionId, { label: "Status", value: "", pill: "PENDING", pillColor: "#f59e0b" })}
    ${statGrid([
      { label: "Document Type", value: documentType },
      { label: "Submitted", value: submittedAt },
    ])}
    ${bodyText(`<span style="font-size:13px;color:#64748b;">You will receive an email notification once your verification is complete. No further action is needed at this time.</span>`)}
    ${ctaButton("View KYC Status →", BRAND.dashboard)}
  `;
  return baseLayout({
    badge: "KYC RECEIVED",
    heroLabel: "Identity Verification",
    heroTitle: "Your KYC documents<br><strong style=\"color:#00c9b1;\">are under review</strong>",
    heroSubtitle:
      "We've received your verification documents. Our compliance team will review them within 24–48 hours.",
    body,
  });
}

// ─────────────────────────────────────────────
// 3. KYC APPROVED
// ─────────────────────────────────────────────
export function kycApprovedEmail({
  name,
  submissionId,
  approvedAt,
}: {
  name: string;
  submissionId: string;
  approvedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your KYC verification has been approved by our compliance team. Your account is now fully activated with access to all platform features.")}
    ${alertBox("<strong>Access Unlocked:</strong> Deposits &middot; Investments &middot; Credit Lines &middot; Withdrawals", "info")}
    ${refRow("Verification ID", submissionId, { label: "Status", value: "", pill: "APPROVED", pillColor: "#059669" })}
    ${statGrid([{ label: "Approved On", value: approvedAt }])}
    ${ctaButton("Start Earning Now →", BRAND.dashboard)}
  `;
  return baseLayout({
    badge: "VERIFIED ✓",
    heroLabel: "Identity Verified",
    heroTitle: "KYC <strong style=\"color:#00c9b1;\">Approved.</strong><br>You're cleared to invest.",
    heroSubtitle:
      "Your identity has been verified. Full platform access is now unlocked — deposits, investments, and credit lines.",
    body,
  });
}

// ─────────────────────────────────────────────
// 4. KYC REJECTED
// ─────────────────────────────────────────────
export function kycRejectedEmail({
  name,
  submissionId,
  reason,
}: {
  name: string;
  submissionId: string;
  reason: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Unfortunately, your KYC submission did not pass our compliance review. This is often due to document quality or a mismatch in details.")}
    ${alertBox(`<strong>Rejection Reason:</strong> ${reason}`, "warning")}
    ${refRow("Reference", submissionId, { label: "Status", value: "", pill: "REJECTED", pillColor: "#dc2626" })}
    ${bodyText(`<span style="font-size:13px;color:#64748b;">You may resubmit corrected documents at any time from your dashboard. If you believe this is an error, please contact our support team.</span>`)}
    ${ctaButton("Resubmit Documents →", BRAND.dashboard)}
  `;
  return baseLayout({
    badge: "ACTION REQUIRED",
    heroLabel: "Verification Update",
    heroTitle: "KYC verification<br><strong style=\"color:#f87171;\">could not be completed</strong>",
    heroSubtitle:
      "We were unable to verify your identity with the documents submitted. Please resubmit with the corrections noted below.",
    body,
  });
}

// ─────────────────────────────────────────────
// 5. DEPOSIT SUBMITTED (User)
// ─────────────────────────────────────────────
export function depositSubmittedEmail({
  name,
  amount,
  method,
  reference,
  submittedAt,
}: {
  name: string;
  amount: string;
  method: string;
  reference: string;
  submittedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your deposit request has been submitted and is now pending admin confirmation. Funds will reflect in your balance within 24 hours.")}
    ${statGrid([
      { label: "Amount", value: amount, green: true },
      { label: "Status", value: "Pending" },
      { label: "Method", value: method },
      { label: "Submitted", value: submittedAt },
    ])}
    ${refRow("Transaction Reference", reference)}
    ${alertBox("Once confirmed by our team, your funds will be available for investment immediately.", "info")}
  `;
  return baseLayout({
    badge: "DEPOSIT RECEIVED",
    heroLabel: "Deposit Submitted",
    heroTitle: `We've received your<br><strong style="color:#00c9b1;">${amount} deposit</strong>`,
    heroSubtitle:
      "Your deposit is pending admin confirmation. Funds will reflect in your balance within 24 hours.",
    body,
  });
}

// ─────────────────────────────────────────────
// 6. DEPOSIT APPROVED (User)
// ─────────────────────────────────────────────
export function depositApprovedEmail({
  name,
  amount,
  newBalance,
  reference,
  approvedAt,
}: {
  name: string;
  amount: string;
  newBalance: string;
  reference: string;
  approvedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your deposit has been verified and credited to your account. Your updated balance is shown below.")}
    ${statGrid([
      { label: "Deposited", value: `+${amount}`, green: true },
      { label: "New Balance", value: newBalance },
    ])}
    ${refRow("Reference", reference, { label: "Status", value: "", pill: "APPROVED", pillColor: "#059669" })}
    ${statGrid([{ label: "Approved On", value: approvedAt }])}
    ${ctaButton("Invest My Funds →", BRAND.dashboard)}
  `;
  return baseLayout({
    badge: "FUNDS CREDITED ✓",
    heroLabel: "Deposit Confirmed",
    heroTitle: `<strong style="color:#00c9b1;">${amount}</strong> has been<br>credited to your account`,
    heroSubtitle:
      "Your deposit has been verified and added to your Apex balance. You're ready to invest.",
    body,
  });
}

// ─────────────────────────────────────────────
// 7. INVESTMENT CONFIRMATION
// ─────────────────────────────────────────────
export function investmentConfirmedEmail({
  name,
  principal,
  apy,
  weeklyYield,
  annualProjection,
  tier,
  investmentId,
  firstPayoutDate,
}: {
  name: string;
  principal: string;
  apy: string;
  weeklyYield: string;
  annualProjection: string;
  tier: string;
  investmentId: string;
  firstPayoutDate: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your investment has been placed and is now actively generating yield. Here's your investment summary:")}
    ${statGrid([
      { label: "Principal", value: principal },
      { label: "APY Rate", value: apy, green: true },
      { label: "Weekly Yield", value: `~${weeklyYield}`, green: true },
      { label: "Annual Proj.", value: `~${annualProjection}`, green: true },
    ])}
    ${refRow("Investment ID", investmentId, { label: "Tier", value: tier })}
    ${alertBox(`<strong>First Distribution:</strong> Earnings are distributed weekly every Friday. Your first payout is on <strong>${firstPayoutDate}</strong>.`, "info")}
    ${ctaButton("View My Portfolio →", BRAND.dashboard)}
  `;
  return baseLayout({
    badge: "INVESTED",
    heroLabel: "Investment Active",
    heroTitle: `Your capital is now<br><strong style="color:#00c9b1;">earning ${apy} APY</strong>`,
    heroSubtitle: `${principal} has been allocated to your selected yield configuration. Weekly distributions begin next Friday.`,
    body,
  });
}

// ─────────────────────────────────────────────
// 8. WITHDRAWAL REQUEST (User)
// ─────────────────────────────────────────────
export function withdrawalSubmittedEmail({
  name,
  amount,
  network,
  walletAddress,
  reference,
  submittedAt,
}: {
  name: string;
  amount: string;
  network: string;
  walletAddress: string;
  reference: string;
  submittedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("We've received your withdrawal request. It is now pending admin approval. Processing typically takes 24–72 hours.")}
    ${statGrid([
      { label: "Amount", value: amount },
      { label: "Network", value: network },
    ])}
    ${refRow("Wallet Address", walletAddress)}
    ${refRow("Reference", reference, { label: "Status", value: "", pill: "PENDING", pillColor: "#f59e0b" })}
    ${statGrid([{ label: "Submitted", value: submittedAt }])}
    ${alertBox("<strong>Important:</strong> Do not submit duplicate withdrawal requests. If you did not initiate this, contact support immediately.", "warning")}
  `;
  return baseLayout({
    badge: "WITHDRAWAL SUBMITTED",
    heroLabel: "Withdrawal Request",
    heroTitle: `Your withdrawal of<br><strong style="color:#00c9b1;">${amount} is processing</strong>`,
    heroSubtitle:
      "Your request has been received and is pending admin approval. Processing time is typically 24–72 hours.",
    body,
  });
}

// ─────────────────────────────────────────────
// 9. WITHDRAWAL APPROVED / PAYOUT SENT
// ─────────────────────────────────────────────
export function withdrawalApprovedEmail({
  name,
  amount,
  network,
  txHash,
  reference,
  processedAt,
}: {
  name: string;
  amount: string;
  network: string;
  txHash: string;
  reference: string;
  processedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your withdrawal has been approved and funds have been dispatched to your registered wallet. Please allow up to 30 minutes for blockchain confirmation.")}
    ${statGrid([
      { label: "Amount Sent", value: amount, green: true },
      { label: "Network", value: network },
    ])}
    ${refRow("TX Hash", txHash)}
    ${refRow("Reference", reference, { label: "Status", value: "", pill: "SENT", pillColor: "#059669" })}
    ${statGrid([{ label: "Processed On", value: processedAt }])}
    ${ctaButton("View Transaction →", `https://tronscan.org/#/transaction/${txHash}`)}
  `;
  return baseLayout({
    badge: "PAYOUT SENT ✓",
    heroLabel: "Payout Confirmed",
    heroTitle: `<strong style="color:#00c9b1;">${amount}</strong> has been sent<br>to your wallet`,
    heroSubtitle:
      "Your withdrawal has been approved and the funds have been dispatched to your registered wallet address.",
    body,
  });
}

// ─────────────────────────────────────────────
// 10. CREDIT LINE REQUEST
// ─────────────────────────────────────────────
export function creditLineSubmittedEmail({
  name,
  requested,
  collateral,
  ltv,
  rate,
  applicationId,
  submittedAt,
}: {
  name: string;
  requested: string;
  collateral: string;
  ltv: string;
  rate: string;
  applicationId: string;
  submittedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your capital-backed credit line application has been received and is under review. Here's a summary of your application:")}
    ${statGrid([
      { label: "Requested", value: requested },
      { label: "LTV", value: ltv },
      { label: "Collateral", value: collateral },
      { label: "Rate", value: rate, green: true },
    ])}
    ${refRow("Application ID", applicationId, { label: "Status", value: "", pill: "PENDING", pillColor: "#f59e0b" })}
    ${statGrid([{ label: "Submitted", value: submittedAt }])}
    ${alertBox("Your collateral assets continue earning yield while your credit line is active. No assets are liquidated during the process.", "info")}
  `;
  return baseLayout({
    badge: "CREDIT LINE",
    heroLabel: "Credit Request Received",
    heroTitle: "Your credit line request<br><strong style=\"color:#00c9b1;\">is under review</strong>",
    heroSubtitle:
      "You've applied for a capital-backed credit line against your cold custody balance. Review typically takes 24 hours.",
    body,
  });
}

// ─────────────────────────────────────────────
// 11. CREDIT LINE APPROVED
// ─────────────────────────────────────────────
export function creditLineApprovedEmail({
  name,
  amount,
  applicationId,
  approvedAt,
}: {
  name: string;
  amount: string;
  applicationId: string;
  approvedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Your credit line application has been approved. The funds have been disbursed to your Apex wallet and are ready to use.")}
    ${alertBox("<strong>Access Granted:</strong> Your credit line is now active. Repayments are flexible with a fixed 4.5% origination rate.", "info")}
    ${statGrid([
      { label: "Credit Amount", value: amount, green: true },
      { label: "Approved On", value: approvedAt },
    ])}
    ${refRow("Application ID", applicationId, { label: "Status", value: "", pill: "APPROVED", pillColor: "#059669" })}
    ${ctaButton("View Credit Dashboard →", BRAND.dashboard)}
  `;
  return baseLayout({
    badge: "CREDIT APPROVED ✓",
    heroLabel: "Credit Line Active",
    heroTitle: `<strong style="color:#00c9b1;">${amount}</strong> credit line<br>has been disbursed`,
    heroSubtitle:
      "Your credit line is now active. Your collateral continues earning yield while you access liquidity.",
    body,
  });
}

// ─────────────────────────────────────────────
// 12. WEEKLY ROI DISTRIBUTION
// ─────────────────────────────────────────────
export function weeklyRoiEmail({
  name,
  weekLabel,
  weekEnding,
  investments,
  totalPrincipal,
  totalEarned,
  portfolioValue,
  nextPayoutDate,
}: {
  name: string;
  weekLabel: string;
  weekEnding: string;
  investments: { label: string; apy: string; principal: string; earned: string }[];
  totalPrincipal: string;
  totalEarned: string;
  portfolioValue: string;
  nextPayoutDate: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText(`Here's your earnings statement for the week ending <strong>${weekEnding}</strong>:`)}
    ${earningsTable(investments, { principal: totalPrincipal, earned: totalEarned })}
    ${divider()}
    ${statGrid([
      { label: "This Week", value: totalEarned, green: true },
      { label: "Portfolio Value", value: portfolioValue },
      { label: "Next Payout", value: nextPayoutDate },
    ])}
    ${ctaButton("View Full Portfolio →", BRAND.dashboard)}
    ${alertBox("Reinvesting your weekly earnings compounds your returns. Visit your dashboard to top up your investment.", "info")}
  `;
  return baseLayout({
    badge: "WEEKLY EARNINGS",
    heroLabel: `Yield Distribution — ${weekLabel}`,
    heroTitle: `You earned <strong style="color:#00c9b1;">${totalEarned}</strong><br>this week 🎯`,
    heroSubtitle:
      "Your weekly yield has been distributed to your Apex wallet. Keep compounding to accelerate your growth.",
    body,
    footerNote: `<a href="${BRAND.dashboard}/settings" style="color:#64748b;">Unsubscribe from weekly reports</a>`,
  });
}

// ─────────────────────────────────────────────
// 13. CONTACT FORM AUTO-REPLY
// ─────────────────────────────────────────────
export function contactAutoReplyEmail({
  name,
  subject,
  ticketId,
  submittedAt,
}: {
  name: string;
  subject: string;
  ticketId: string;
  submittedAt: string;
}): string {
  const body = `
    ${bodyText(`Hello <strong>${name}</strong>,`)}
    ${bodyText("Thank you for reaching out to Apex Asset Management. We've received your message and our support team will respond within 24–48 hours.")}
    ${refRow("Ticket ID", ticketId)}
    ${statGrid([
      { label: "Subject", value: subject },
      { label: "Submitted", value: submittedAt },
    ])}
    ${bodyText(`<span style="font-size:13px;color:#64748b;">For urgent matters, you can also reach us directly at <a href="mailto:${BRAND.sender}" style="color:#00c9b1;">${BRAND.sender}</a></span>`)}
    ${ctaButton("Go to Dashboard →", BRAND.dashboard)}
  `;
  return baseLayout({
    badge: "SUPPORT",
    heroLabel: "Message Received",
    heroTitle: "We've received<br><strong style=\"color:#00c9b1;\">your message</strong>",
    heroSubtitle:
      "Our support team will review your inquiry and respond within 24–48 business hours.",
    body,
  });
}

// ─────────────────────────────────────────────
// 14. ADMIN ALERT (internal)
// ─────────────────────────────────────────────
export function adminAlertEmail({
  eventType,
  userName,
  userEmail,
  details,
  reference,
  timestamp,
  adminUrl,
}: {
  eventType: string;
  userName: string;
  userEmail: string;
  details: { label: string; value: string; green?: boolean }[];
  reference: string;
  timestamp: string;
  adminUrl?: string;
}): string {
  const body = `
    ${alertBox(`<strong>Admin Action Required:</strong> A new <strong>${eventType}</strong> requires your review and action.`, "warning")}
    ${statGrid(details)}
    ${refRow("Reference", reference)}
    ${statGrid([
      { label: "User", value: userName },
      { label: "Email", value: userEmail },
    ])}
    ${statGrid([{ label: "Submitted At", value: timestamp }])}
    ${ctaButton("Review in Admin Panel →", adminUrl || "https://apexroi.vercel.app/admin", "#ef4444")}
  `;

  // Admin emails use red accent
  const html = baseLayout({
    badge: "⚡ ADMIN ALERT",
    heroLabel: "Action Required",
    heroTitle: `New <strong style="color:#f87171;">${eventType}</strong><br>awaiting your approval`,
    heroSubtitle: `A platform event requires admin review. Please log in to the admin panel to take action.`,
    body,
    footerNote: "Internal admin notification — do not forward.",
    accentColor: "#f87171",
    headerBg: "#1a0808",
  });
  return html;
}
