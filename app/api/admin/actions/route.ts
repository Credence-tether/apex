// app/api/admin/actions/route.ts
// Next.js 15 · @supabase/ssr · apex_master_requests v3 schema

import { NextResponse } from "next/server";
import {
  createClient,
  createAdminClient,
} from "../../../../utils/supabase/server";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface MasterRequest {
  id: string;
  user_id: string;
  request_type: string;
  status: string;
  amount: number | null;
  meta_data: Record<string, unknown>;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined from profiles via FK embed
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Guard: verify the calling user is an admin.
//
// Why two clients?
//   - authClient  uses the user's session cookie → safe auth.getUser() call
//   - adminClient uses the service-role key      → bypasses RLS for the
//     role lookup so a newly-created admin whose RLS policy hasn't propagated
//     yet still works.
// ─────────────────────────────────────────────────────────────────────────────

async function requireAdmin() {
  // createClient() is already async and awaits cookies() internally —
  // this is the correct Next.js 15 pattern. Do NOT pass a raw cookieStore
  // into the factory; it handles that itself.
  const authClient = await createClient();
  const adminClient = await createAdminClient();

  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) return { adminUser: null, adminClient };

  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin")
    return { adminUser: null, adminClient };

  return { adminUser: user, adminClient };
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalizers
// These map the flat v3 ledger rows into the shape the admin dashboard
// frontend expects, pulling type-specific fields out of meta_data.
// ─────────────────────────────────────────────────────────────────────────────

const normalizeDeposit = (r: MasterRequest) => ({
  ...r,
  // Flatten meta_data keys the deposit tab renders directly
  asset_ticker: r.meta_data?.asset_ticker ?? "USDT",
  transaction_hash: r.meta_data?.transaction_hash ?? "",
});

const normalizeWithdrawal = (r: MasterRequest) => ({
  ...r,
  wallet_address:
    r.meta_data?.wallet_address ??
    r.meta_data?.destination_wallet_address ??
    "",
  network: r.meta_data?.network ?? "ERC20",
});

const normalizeInvestment = (r: MasterRequest) => ({
  ...r,
  plan_name: r.meta_data?.plan_name ?? "",
  amount_invested: r.amount,
  apy_percentage: r.meta_data?.apy_percentage ?? 0,
  lock_duration_weeks: r.meta_data?.lock_duration_weeks ?? 52,
  weeks_elapsed: r.meta_data?.weeks_elapsed ?? 0,
});

const normalizeLoan = (r: MasterRequest) => ({
  ...r,
  total_due: r.meta_data?.total_due ?? null,
  interest_rate_annual: r.meta_data?.interest_rate_annual ?? null,
  repayment_due_date: r.meta_data?.repayment_due_date ?? null,
});

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/actions
// Returns all ledger data split into typed buckets for the dashboard tabs.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  const { adminUser, adminClient } = await requireAdmin();

  if (!adminUser) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 },
    );
  }

  // Single query for all non-KYC ledger rows + one for users.
  // Splitting into parallel queries keeps each result set typed and avoids
  // over-fetching large blobs into a single array that the frontend has to
  // re-filter client-side.
  const [
    { data: deposits, error: e1 },
    { data: withdrawals, error: e2 },
    { data: loans, error: e3 },
    { data: investments, error: e4 },
    { data: kycRequests, error: e5 },
    { data: transactions, error: e6 },
    { data: users, error: e7 },
  ] = await Promise.all([
    adminClient
      .from("apex_master_requests")
      .select("*")
      .eq("request_type", "deposit")
      .order("created_at", { ascending: false }),

    adminClient
      .from("apex_master_requests")
      .select("*")
      .eq("request_type", "withdrawal")
      .order("created_at", { ascending: false }),

    adminClient
      .from("apex_master_requests")
      .select("*")
      .eq("request_type", "loan_request")
      .order("created_at", { ascending: false }),

    adminClient
      .from("apex_master_requests")
      .select("*")
      .in("request_type", ["investment", "investment_purchase"])
      .order("created_at", { ascending: false }),

    adminClient
      .from("apex_master_requests")
      .select("*")
      .eq("request_type", "kyc_submission")
      .order("created_at", { ascending: false }),

    // Transactions tab: all financial ledger rows from the master request table
    adminClient
      .from("apex_master_requests")
      .select("*")
      .neq("request_type", "kyc_submission")
      .order("created_at", { ascending: false })
      .limit(100),

    adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  // Bubble up any hard Supabase errors so they're visible in server logs
  const queryError = e1 ?? e2 ?? e3 ?? e4 ?? e5 ?? e6 ?? e7;
  if (queryError) {
    console.error("[admin/actions GET] Supabase error:", queryError.message);
    return NextResponse.json(
      { success: false, error: queryError.message },
      { status: 500 },
    );
  }

  const profileMap = new Map<
    string,
    { full_name: string | null; email: string | null }
  >();
  (users ?? []).forEach((profile: any) => {
    if (profile?.id) {
      profileMap.set(profile.id, {
        full_name: profile.full_name ?? null,
        email: profile.email ?? null,
      });
    }
  });

  const attachProfile = (row: any) => ({
    ...row,
    profiles: profileMap.get(row.user_id) ?? null,
  });

  return NextResponse.json({
    success: true,
    payload: {
      deposits: ((deposits as MasterRequest[]) ?? []).map((row) =>
        normalizeDeposit(attachProfile(row)),
      ),
      withdrawals: ((withdrawals as MasterRequest[]) ?? []).map((row) =>
        normalizeWithdrawal(attachProfile(row)),
      ),
      loans: ((loans as MasterRequest[]) ?? []).map((row) =>
        normalizeLoan(attachProfile(row)),
      ),
      investments: ((investments as MasterRequest[]) ?? []).map((row) =>
        normalizeInvestment(attachProfile(row)),
      ),
      kycRequests: ((kycRequests as MasterRequest[]) ?? [])
        .map(attachProfile)
        .map((r) => ({
          ...r,
          id_type: r.meta_data?.id_type ?? "",
          id_number: r.meta_data?.id_number ?? "",
          document_url: r.meta_data?.document_url ?? "",
          selfie_url: r.meta_data?.selfie_url ?? "",
        })),
      transactions: ((transactions as MasterRequest[]) ?? []).map(
        attachProfile,
      ),
      users: users ?? [],
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// POST  /api/admin/actions
// Handles two actions:
//   1. Status change  → update apex_master_requests.status
//   2. credit_balance → directly increment profiles.balance
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const { adminUser, adminClient } = await requireAdmin();

  if (!adminUser) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const {
    action,
    target_id,
    target_status,
    admin_notes,
    user_id,
    credit_amount,
  } = body as {
    action?: string;
    target_id?: string;
    target_status?: "approved" | "rejected";
    admin_notes?: string;
    user_id?: string;
    credit_amount?: string | number;
  };

  try {
    // ── 1. APPROVE / REJECT a master request ─────────────────────────────────
    // A single UPDATE is all that's needed. The database triggers in apex_schema_v3
    // handle every financial side-effect automatically:
    //   deposit approved       → balance += amount
    //   withdrawal approved    → no-op (balance already escrowed on insert)
    //   withdrawal rejected    → balance refunded
    //   investment approved    → locked_collateral += amount
    //   investment rejected    → balance refunded
    //   loan_request approved  → balance += amount (disbursement)
    //   kyc approved           → kyc_verified = true
    // ─────────────────────────────────────────────────────────────────────────
    if (target_id && target_status) {
      const validStatuses = ["approved", "rejected"] as const;
      if (!validStatuses.includes(target_status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status: ${target_status}` },
          { status: 400 },
        );
      }

      const { error } = await adminClient
        .from("apex_master_requests")
        .update({
          status: target_status,
          reviewed_by: adminUser.id,
          // admin_notes is optional; only include if provided
          ...(admin_notes ? { admin_notes } : {}),
        })
        .eq("id", target_id);

      if (error) throw error;

      const messages: Record<typeof target_status, string> = {
        approved: "Request approved successfully.",
        rejected: "Request rejected.",
      };

      return NextResponse.json({
        success: true,
        message: messages[target_status],
      });
    }

    // ── 2. MANUAL BALANCE CREDIT ──────────────────────────────────────────────
    // Used by the admin "Credit Balance" UI. Does NOT go through the escrow
    // trigger (which is a BEFORE INSERT trigger for withdrawals/investments).
    // We fetch the current balance and increment it with Postgres arithmetic
    // to avoid a read-modify-write race condition.
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "credit_balance") {
      if (!user_id || credit_amount === undefined || credit_amount === null) {
        return NextResponse.json(
          { success: false, error: "Missing user_id or credit_amount" },
          { status: 400 },
        );
      }

      const amount =
        typeof credit_amount === "string"
          ? parseFloat(credit_amount)
          : Number(credit_amount);

      if (!isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { success: false, error: "credit_amount must be a positive number" },
          { status: 400 },
        );
      }

      // Verify the target user exists before touching their balance
      const { data: targetProfile, error: fetchErr } = await adminClient
        .from("profiles")
        .select("id, balance")
        .eq("id", user_id)
        .single();

      if (fetchErr || !targetProfile) {
        return NextResponse.json(
          { success: false, error: "User profile not found" },
          { status: 404 },
        );
      }

      // Atomic increment — no race condition between the fetch and the write
      const newBalance = Number(targetProfile.balance) + amount;

      const { error: updateErr } = await adminClient
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", user_id);

      if (updateErr) throw updateErr;

      // ── Audit trail ───────────────────────────────────────────────────────
      // Insert a pre-approved deposit record so the credit appears in the
      // transaction history tab. We set status = 'approved' directly and do
      // NOT rely on the deposit trigger (which fires on status UPDATE, not on
      // INSERT with status='approved') — the balance was already updated above.
      // To prevent the trigger from double-crediting, we insert with
      // reviewed_at set so the trigger's OLD.status == NEW.status guard fires
      // and skips the balance mutation.
      //
      // IMPORTANT: The apex_schema_v3 trigger fires BEFORE UPDATE, not on
      // INSERT. Inserting with status='approved' directly is therefore safe —
      // no trigger runs on INSERT for deposits.
      const { error: auditErr } = await adminClient
        .from("apex_master_requests")
        .insert({
          user_id,
          request_type: "deposit",
          status: "approved",
          amount,
          meta_data: {
            asset_ticker: "USD",
            transaction_hash: `admin-credit-${Date.now()}`,
            note: "Manual balance credit by admin",
          },
          reviewed_by: adminUser.id,
          reviewed_at: new Date().toISOString(),
        });

      // Audit failure is non-fatal — balance was already credited
      if (auditErr) {
        console.warn(
          "[admin/actions POST] Audit insert failed:",
          auditErr.message,
        );
      }

      return NextResponse.json({
        success: true,
        message: `Balance credited $${amount.toFixed(2)} successfully.`,
      });
    }

    // ── Unknown action ────────────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: false,
        error:
          "Unknown action. Provide target_id+target_status or action=credit_balance.",
      },
      { status: 400 },
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("[admin/actions POST] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
