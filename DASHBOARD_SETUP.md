# Dashboard Setup & Schema Integration Guide

## Database Schema Overview

Your Apex application uses these 9 main tables:

| Table                         | Purpose                           | Key Columns                                                                                     |
| ----------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| **apex_wallets**              | User account balance & collateral | available_balance, total_earnings, locked_collateral, user_id                                   |
| **apex_investments**          | Active investment contracts       | plan_name, amount_invested, apy_percentage, weeks_elapsed, lock_duration_weeks, status, user_id |
| **apex_deposit_requests**     | Deposit transaction requests      | amount_deposited, status, transaction_hash, created_at, user_id                                 |
| **apex_transactions**         | Transaction history               | type, gross_amount, net_amount, platform_fee, status, user_id, created_at                       |
| **apex_loans**                | Loans linked to investments       | loan_principal, total_due, interest_rate_annual, status, investment_id, user_id                 |
| **apex_user_payment_methods** | Crypto wallet addresses           | crypto_wallet_address, blockchain_network, is_active, user_id                                   |
| **profiles**                  | User profile data                 | full_name, kyc_status, user_role, user_id                                                       |
| **apex_legal_documents**      | Legal/compliance docs             | content, document_type, version_number                                                          |
| **contact_submissions**       | Contact form entries              | full_name, email, message                                                                       |

## Dashboard Implementation

### Features Added

✅ **Three-Tab Interface:**

- **Overview** - Recent deposit requests and account summary
- **Investments** - Active investment contracts with APY details
- **Transactions** - Transaction history with type and net amounts

✅ **Wallet Display:**

- Available Balance (from `apex_wallets.available_balance`)
- Total Earnings (from `apex_wallets.total_earnings`)
- Locked Collateral (from `apex_wallets.locked_collateral`)

✅ **CTAs (Call-to-Action Buttons):**

- **+ Deposit Funds** - Opens form to submit deposit request (inserts to `apex_deposit_requests`)
- **Withdraw** - Placeholder for withdrawal feature
- **Transactions** - Switch to transactions tab
- **Payment Methods** - Placeholder for payment method management

✅ **Investment Display:**

- Shows plan name, principal amount, APY percentage
- Displays progress: "X of Y weeks" (weeks_elapsed / lock_duration_weeks)
- Color-coded APY in cyan (#00d1b2)

✅ **Deposit Tracking:**

- Recent deposit requests with status badges
- Status colors: Green (approved), Red (rejected), Yellow (pending)
- Date formatted for readability

✅ **Transaction History:**

- Type, amount, and date for each transaction
- Color-coded: Green for deposits, Red for withdrawals
- Shows net_amount and platform fees

### Error Handling

- Gracefully handles missing Supabase configuration
- Handles missing database tables (code 42501 permission errors, code PGRST116 not found)
- Falls back to default data ($0.00) when tables don't exist
- Displays friendly configuration error message

## Setup Instructions

### Step 1: Configure Supabase Credentials

1. Get your credentials from [supabase.com/dashboard](https://supabase.com/dashboard)
2. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

### Step 2: Set Up Row Level Security (RLS)

Add these RLS policies to each table so users only see their own data:

```sql
-- For apex_wallets table
CREATE POLICY "Users can view own wallet"
  ON apex_wallets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON apex_wallets
  FOR UPDATE
  USING (auth.uid() = user_id);

-- For apex_investments table
CREATE POLICY "Users can view own investments"
  ON apex_investments
  FOR SELECT
  USING (auth.uid() = user_id);

-- For apex_deposit_requests table
CREATE POLICY "Users can create deposits"
  ON apex_deposit_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own deposits"
  ON apex_deposit_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- For apex_transactions table
CREATE POLICY "Users can view own transactions"
  ON apex_transactions
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Step 3: Test the Workflow

1. Go to `/dashboard`
2. You'll see the three-tab interface with mock data ($0.00)
3. Click **"+ Deposit Funds"** to submit a deposit request
4. The request inserts into `apex_deposit_requests` table
5. Check the deposit status under "Recent Deposit Requests"

### Step 4: Populate Sample Data

To test with real data, insert test records:

```sql
-- Insert test wallet for user
INSERT INTO apex_wallets (user_id, available_balance, total_earnings, locked_collateral)
VALUES (auth.uid(), 5000.00, 150.50, 2000.00);

-- Insert test investment
INSERT INTO apex_investments (
  user_id, plan_name, amount_invested, apy_percentage,
  weeks_elapsed, lock_duration_weeks, status
)
VALUES (
  auth.uid(),
  'Premium APY Plan',
  2000.00,
  0.12,
  4,
  52,
  'active'
);

-- Insert test transaction
INSERT INTO apex_transactions (
  user_id, type, gross_amount, net_amount, platform_fee, status
)
VALUES (
  auth.uid(),
  'deposit',
  5000.00,
  4950.00,
  50.00,
  'completed'
);
```

## Code References

### File: [app/dashboard/page.tsx](app/dashboard/page.tsx)

**State Management:**

```typescript
const [wallet, setWallet] = useState<any>(null);
const [investments, setInvestments] = useState<any[]>([]);
const [deposits, setDeposits] = useState<any[]>([]);
const [transactions, setTransactions] = useState<any[]>([]);
const [activeTab, setActiveTab] = useState<
  "overview" | "investments" | "transactions"
>("overview");
```

**Queries Pattern:**

```typescript
// Fetch wallet
const { data: walletData, error: walletError } = await supabase
  .from("apex_wallets")
  .select("*")
  .eq("user_id", authUser.id)
  .single();

// Fetch active investments only
const { data: investmentData, error: investError } = await supabase
  .from("apex_investments")
  .select("*")
  .eq("user_id", authUser.id)
  .eq("status", "active");

// Insert deposit request
const { error } = await supabase.from("apex_deposit_requests").insert({
  user_id: user?.id,
  amount_deposited: parseFloat(depositAmount),
  status: "pending",
});
```

**Display Pattern:**

```typescript
{/* TAB CONTENT - INVESTMENTS */}
{activeTab === "investments" && (
  <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
    {investments.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No active investments yet.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {investments.map((inv) => (
          <div key={inv.id} className="flex justify-between items-center p-4 bg-[#09091f] rounded">
            <div className="flex-1">
              <p className="font-semibold text-white">{inv.plan_name}</p>
              <p className="text-sm text-gray-400">
                Principal: ${inv.amount_invested?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-500">
                {inv.weeks_elapsed} of {inv.lock_duration_weeks} weeks
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
```

## Column Name Mapping

The dashboard correctly maps database columns to display:

| Database Column                     | Display Location      | Format         |
| ----------------------------------- | --------------------- | -------------- |
| available_balance                   | Wallet Card 1         | $X.XX          |
| total_earnings                      | Wallet Card 2         | $X.XX (cyan)   |
| locked_collateral                   | Wallet Card 3         | $X.XX (yellow) |
| plan_name                           | Investment row        | Text           |
| amount_invested                     | Investment row        | $X.XX          |
| apy_percentage                      | Investment card       | X.X% APY       |
| weeks_elapsed / lock_duration_weeks | Investment row        | "X of Y weeks" |
| status                              | Investment row, Badge | Text           |
| amount_deposited                    | Deposit row           | $X.XX          |
| status                              | Deposit badge         | Color-coded    |
| created_at                          | Both deposits & txn   | Formatted date |
| type                                | Transaction type      | Capitalized    |
| net_amount                          | Transaction amount    | $X.XX          |

## Next Steps

1. ✅ Update `.env.local` with real Supabase credentials
2. ✅ Enable RLS policies on all tables (copy SQL above)
3. ✅ Seed sample data if needed (copy SQL above)
4. ✅ Test deposit submission → should appear in Recent Deposits
5. ✅ Test investment display → should show in Investments tab
6. ✅ Test transaction display → should show in Transactions tab
7. ⏳ Implement withdrawal logic
8. ⏳ Implement payment methods management
9. ⏳ Implement investment creation feature

---

**Questions?** Check the Supabase documentation at https://supabase.com/docs or review the error messages in browser console.
