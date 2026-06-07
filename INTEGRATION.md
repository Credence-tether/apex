# Apex Email System — Integration Guide

## Setup

### 1. Install Resend
```bash
npm install resend
```

### 2. Environment Variables
Add to `.env.local` (and Vercel dashboard):
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=support@apxfund.xyz
```

### 3. Copy email files into your project
```
your-project/
└── emails/
    ├── index.ts          ← main sender (copy this)
    └── templates/
        ├── base.ts       ← layout helpers (copy this)
        └── templates.ts  ← all 14 templates (copy this)
```

---

## API Route Integration

### `app/auth/callback/route.ts` — Welcome email on signup
```ts
import { sendWelcomeEmail } from "@/emails";

// After successful user creation:
await sendWelcomeEmail({
  to: user.email,
  name: user.user_metadata?.full_name || "Investor",
});
```

---

### `app/api/kyc/route.ts` — KYC submitted
```ts
import { sendKycSubmittedEmail } from "@/emails";

// After inserting KYC record:
await sendKycSubmittedEmail({
  to: user.email,
  name: profile.full_name,
  documentType: body.document_type || "Government ID",
});
```

---

### `app/api/admin/actions/route.ts` — KYC approved/rejected
```ts
import { sendKycApprovedEmail, sendKycRejectedEmail } from "@/emails";

if (action === "kyc_approve") {
  await sendKycApprovedEmail({
    to: user.email,
    name: profile.full_name,
    submissionId: kyc.id,
  });
}

if (action === "kyc_reject") {
  await sendKycRejectedEmail({
    to: user.email,
    name: profile.full_name,
    reason: body.reason || "Document could not be verified.",
    submissionId: kyc.id,
  });
}
```

---

### `app/api/deposit/route.ts` — Deposit submitted
```ts
import { sendDepositSubmittedEmail } from "@/emails";

// Sends user confirmation + admin alert automatically:
const reference = await sendDepositSubmittedEmail({
  to: user.email,
  name: profile.full_name,
  amount: body.amount,          // number e.g. 1500
  method: body.method,          // e.g. "USDT (TRC20)"
});
```

---

### `app/api/admin/actions/route.ts` — Deposit approved
```ts
import { sendDepositApprovedEmail } from "@/emails";

if (action === "deposit_approve") {
  await sendDepositApprovedEmail({
    to: user.email,
    name: profile.full_name,
    amount: deposit.amount,
    newBalance: wallet.balance,
    reference: deposit.reference,
  });
}
```

---

### `app/api/invest/route.ts` — Investment placed
```ts
import { sendInvestmentConfirmedEmail } from "@/emails";

await sendInvestmentConfirmedEmail({
  to: user.email,
  name: profile.full_name,
  principal: body.amount,       // number e.g. 1000
  apy: body.apy_rate,           // number e.g. 11.4
  tier: body.tier_name,         // e.g. "Professional"
});
```

---

### `app/api/withdraw/route.ts` — Withdrawal submitted
```ts
import { sendWithdrawalSubmittedEmail } from "@/emails";

// Sends user confirmation + admin alert automatically:
const reference = await sendWithdrawalSubmittedEmail({
  to: user.email,
  name: profile.full_name,
  amount: body.amount,
  network: body.network || "TRC20",
  walletAddress: body.wallet_address,
});
```

---

### `app/api/admin/actions/route.ts` — Withdrawal approved
```ts
import { sendWithdrawalApprovedEmail } from "@/emails";

if (action === "withdrawal_approve") {
  await sendWithdrawalApprovedEmail({
    to: user.email,
    name: profile.full_name,
    amount: withdrawal.amount,
    txHash: body.tx_hash,
    reference: withdrawal.reference,
  });
}
```

---

### `app/api/loan/route.ts` — Credit line request
```ts
import { sendCreditLineSubmittedEmail } from "@/emails";

// Sends user confirmation + admin alert automatically:
const applicationId = await sendCreditLineSubmittedEmail({
  to: user.email,
  name: profile.full_name,
  requested: body.amount,
  collateral: wallet.locked_balance,
});
```

---

### `app/api/admin/actions/route.ts` — Credit line approved
```ts
import { sendCreditLineApprovedEmail } from "@/emails";

if (action === "loan_approve") {
  await sendCreditLineApprovedEmail({
    to: user.email,
    name: profile.full_name,
    amount: loan.amount,
    applicationId: loan.id,
  });
}
```

---

### `app/api/contact/route.ts` — Contact form
```ts
import { sendContactAutoReply } from "@/emails";

// Sends auto-reply to user + admin notification automatically:
await sendContactAutoReply({
  to: body.email,
  name: body.name,
  subject: body.subject,
});
```

---

## Weekly ROI — pg_cron or API route

### Option A: Trigger via API route (call from cron)
```ts
// app/api/cron/roi/route.ts
import { sendWeeklyRoiEmail } from "@/emails";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Fetch all active investors from Supabase
  const { data: investors } = await supabase
    .from("investments")
    .select("*, profiles(*), wallets(*)")
    .eq("status", "active");

  for (const inv of investors) {
    const weeklyEarned = (inv.amount * (inv.apy_rate / 100)) / 52;
    await sendWeeklyRoiEmail({
      to: inv.profiles.email,
      name: inv.profiles.full_name,
      investments: [{
        label: inv.tier_name,
        apy: `${inv.apy_rate}%`,
        principal: inv.amount,
        earned: weeklyEarned,
      }],
      portfolioValue: inv.wallets.balance,
    });
  }

  return Response.json({ sent: investors.length });
}
```

### Option B: Add to Vercel cron (vercel.json)
```json
{
  "crons": [{
    "path": "/api/cron/roi",
    "schedule": "0 8 * * 5"
  }]
}
```
*(Runs every Friday at 8:00 AM UTC)*

---

## Resend Domain Setup

1. Go to [resend.com](https://resend.com) → Domains → Add Domain → `apxfund.xyz`
2. Add the DNS records they give you (SPF, DKIM, DMARC)
3. Verify → you're live with `support@apxfund.xyz`

---

## Error Handling Pattern

Wrap all email sends so they never crash your API:

```ts
async function safeSend(fn: () => Promise<any>, label: string) {
  try {
    await fn();
  } catch (err) {
    console.error(`[Email] ${label} failed:`, err);
    // Never throw — email failure should not fail the API response
  }
}

// Usage:
await safeSend(
  () => sendDepositSubmittedEmail({ to, name, amount }),
  "deposit-submitted"
);
```
