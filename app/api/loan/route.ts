import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const principal = parseFloat(amount);

    console.log("[POST /api/loan] Request received", { principal });

    if (isNaN(principal) || principal <= 0) {
      console.warn("[POST /api/loan] Invalid loan amount:", principal);
      return NextResponse.json(
        { success: false, error: "Invalid credit draw amount" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[POST /api/loan] Unauthorized access attempt");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch user's active investments
    const { data: investments, error: investErr } = await supabase
      .from("apex_investments")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (investErr || !investments || investments.length === 0) {
      console.warn("[POST /api/loan] No active investments for user:", user.id);
      return NextResponse.json(
        {
          success: false,
          error: "You must have an active investment to request credit lines.",
        },
        { status: 400 },
      );
    }

    const activeInvestmentId = investments[0].id;

    // Verify 50% LTV constraint: credit requires double its value in active vault assets
    const { data: wallet, error: walletErr } = await supabase
      .from("apex_wallets")
      .select("available_balance")
      .eq("user_id", user.id)
      .single();

    const availableBalance = wallet?.available_balance || 0;
    const requiredVaultAssets = principal * 2;

    if (availableBalance < requiredVaultAssets) {
      console.warn(
        "[POST /api/loan] LTV constraint violation for user:",
        user.id,
        "Required:",
        requiredVaultAssets,
        "Available:",
        availableBalance,
      );
      return NextResponse.json(
        {
          success: false,
          error: `Requested credit requires $${requiredVaultAssets} in active vault assets. You have $${availableBalance} available.`,
        },
        { status: 400 },
      );
    }

    // Create loan record
    const { error: loanErr } = await supabase.from("apex_loans").insert([
      {
        user_id: user.id,
        investment_id: activeInvestmentId,
        loan_principal: principal,
        status: "active",
      },
    ]);

    if (loanErr) {
      console.error("[POST /api/loan] Failed to create loan:", loanErr);
      throw loanErr;
    }

    console.log(
      "[POST /api/loan] Success for user:",
      user.id,
      "Amount:",
      principal,
      "Investment ID:",
      activeInvestmentId,
    );
    return NextResponse.json(
      { success: true, message: "Asset credit lines requested successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[POST /api/loan] Server error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
