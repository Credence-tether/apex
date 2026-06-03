import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

async function requireAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_role")
    .eq("id", user.id)
    .single();
  if (profile?.user_role !== "admin") return null;
  return user;
}

export async function GET() {
  const supabase = await createClient();
  const adminUser = await requireAdmin(supabase);
  if (!adminUser)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 },
    );

  const [
    { data: deposits },
    { data: withdrawals },
    { data: loans },
    { data: users },
    { data: investments },
    { data: transactions },
  ] = await Promise.all([
    supabase
      .from("apex_deposit_requests")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("apex_withdrawals")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("apex_loans")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("*, apex_wallets(available_balance, total_earnings)")
      .order("created_at", { ascending: false }),
    supabase
      .from("apex_investments")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("apex_transactions")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  return NextResponse.json({
    success: true,
    payload: {
      deposits: deposits || [],
      withdrawals: withdrawals || [],
      loans: loans || [],
      users: users || [],
      investments: investments || [],
      transactions: transactions || [],
    },
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const adminUser = await requireAdmin(supabase);
  if (!adminUser)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 },
    );

  const {
    action,
    target_table,
    target_id,
    target_status,
    user_id,
    credit_amount,
  } = await request.json();

  try {
    // --- APPROVE DEPOSIT ---
    if (
      action === "approve_deposit" ||
      (target_table === "apex_deposit_requests" && target_status === "approved")
    ) {
      const { data: deposit } = await supabase
        .from("apex_deposit_requests")
        .select("*")
        .eq("id", target_id)
        .single();

      if (!deposit)
        return NextResponse.json(
          { success: false, error: "Deposit not found" },
          { status: 404 },
        );

      await supabase
        .from("apex_deposit_requests")
        .update({ status: "approved" })
        .eq("id", target_id);

      const { data: wallet } = await supabase
        .from("apex_wallets")
        .select("available_balance, total_earnings")
        .eq("user_id", deposit.user_id)
        .single();

      if (wallet) {
        await supabase
          .from("apex_wallets")
          .update({
            available_balance:
              Number(wallet.available_balance) +
              Number(deposit.amount_deposited),
          })
          .eq("user_id", deposit.user_id);
      } else {
        await supabase.from("apex_wallets").insert([
          {
            user_id: deposit.user_id,
            available_balance: Number(deposit.amount_deposited),
            total_earnings: 0,
            locked_collateral: 0,
          },
        ]);
      }

      await supabase.from("apex_transactions").insert([
        {
          user_id: deposit.user_id,
          type: "deposit",
          gross_amount: deposit.amount_deposited,
          net_amount: deposit.amount_deposited,
          platform_fee: 0,
          status: "completed",
          description: `Deposit approved: ${deposit.asset_ticker || "USDT"} via ${deposit.transaction_hash}`,
        },
      ]);

      return NextResponse.json({
        success: true,
        message: "Deposit approved and wallet credited.",
      });
    }

    // --- APPROVE WITHDRAWAL ---
    if (target_table === "apex_withdrawals" && target_status === "approved") {
      await supabase
        .from("apex_withdrawals")
        .update({ status: "approved" })
        .eq("id", target_id);
      return NextResponse.json({
        success: true,
        message: "Withdrawal approved.",
      });
    }

    // --- REJECT WITHDRAWAL ---
    if (target_table === "apex_withdrawals" && target_status === "rejected") {
      const { data: withdrawal } = await supabase
        .from("apex_withdrawals")
        .select("*")
        .eq("id", target_id)
        .single();

      if (withdrawal) {
        const { data: wallet } = await supabase
          .from("apex_wallets")
          .select("available_balance")
          .eq("user_id", withdrawal.user_id)
          .single();

        if (wallet) {
          await supabase
            .from("apex_wallets")
            .update({
              available_balance:
                Number(wallet.available_balance) + Number(withdrawal.amount),
            })
            .eq("user_id", withdrawal.user_id);
        }
      }

      await supabase
        .from("apex_withdrawals")
        .update({ status: "rejected" })
        .eq("id", target_id);
      return NextResponse.json({
        success: true,
        message: "Withdrawal rejected and balance refunded.",
      });
    }

    // --- APPROVE LOAN ---
    if (target_table === "apex_loans" && target_status === "approved") {
      const { data: loan } = await supabase
        .from("apex_loans")
        .select("*")
        .eq("id", target_id)
        .single();

      if (!loan)
        return NextResponse.json(
          { success: false, error: "Loan not found" },
          { status: 404 },
        );

      const { data: wallet } = await supabase
        .from("apex_wallets")
        .select("available_balance")
        .eq("user_id", loan.user_id)
        .single();

      if (wallet) {
        await supabase
          .from("apex_wallets")
          .update({
            available_balance:
              Number(wallet.available_balance) + Number(loan.loan_principal),
          })
          .eq("user_id", loan.user_id);
      } else {
        await supabase.from("apex_wallets").insert([
          {
            user_id: loan.user_id,
            available_balance: Number(loan.loan_principal),
            total_earnings: 0,
            locked_collateral: 0,
          },
        ]);
      }

      // These always run regardless of wallet existing or not
      await supabase
        .from("apex_loans")
        .update({ status: "approved" })
        .eq("id", target_id);

      await supabase.from("apex_transactions").insert([
        {
          user_id: loan.user_id,
          type: "disbursement",
          gross_amount: loan.loan_principal,
          net_amount: loan.loan_principal,
          platform_fee: 0,
          status: "completed",
          description: `Loan disbursement approved`,
        },
      ]);

      return NextResponse.json({
        success: true,
        message: "Loan approved and funds disbursed.",
      });
    }

    // --- MANUAL BALANCE CREDIT ---
    if (action === "credit_balance") {
      if (!user_id || !credit_amount)
        return NextResponse.json(
          { success: false, error: "Missing user_id or credit_amount" },
          { status: 400 },
        );

      const amount = parseFloat(credit_amount);

      const { data: wallet } = await supabase
        .from("apex_wallets")
        .select("available_balance")
        .eq("user_id", user_id)
        .single();

      if (wallet) {
        await supabase
          .from("apex_wallets")
          .update({
            available_balance: Number(wallet.available_balance) + amount,
          })
          .eq("user_id", user_id);
      } else {
        await supabase.from("apex_wallets").insert([
          {
            user_id,
            available_balance: amount,
            total_earnings: 0,
            locked_collateral: 0,
          },
        ]);
      }

      await supabase.from("apex_transactions").insert([
        {
          user_id,
          type: "admin_credit",
          gross_amount: amount,
          net_amount: amount,
          platform_fee: 0,
          status: "completed",
          description: `Manual balance credit by admin`,
        },
      ]);

      return NextResponse.json({
        success: true,
        message: "Balance credited successfully.",
      });
    }

    // --- GENERIC STATUS UPDATE ---
    if (target_table && target_id && target_status) {
      const { error } = await supabase
        .from(target_table)
        .update({ status: target_status })
        .eq("id", target_id);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Status updated." });
    }

    return NextResponse.json(
      { success: false, error: "Unknown action" },
      { status: 400 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
