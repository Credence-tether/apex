import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const principal = parseFloat(amount);

    if (isNaN(principal) || principal <= 0)
      return NextResponse.json(
        { success: false, error: "Invalid credit draw amount" },
        { status: 400 },
      );

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    // Verify user has an approved investment (investment_purchase with status='approved')
    const { data: investments, error: investErr } = await supabase
      .from("apex_master_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("request_type", "investment_purchase")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (investErr || !investments || investments.length === 0)
      return NextResponse.json(
        {
          success: false,
          error:
            "You must have an approved investment to request credit lines.",
        },
        { status: 400 },
      );

    // 50% LTV: need 2× loan amount in balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    const availableBalance = Number(profile?.balance || 0);
    const requiredCollateral = principal * 2;

    if (availableBalance < requiredCollateral)
      return NextResponse.json(
        {
          success: false,
          error: `Requested credit requires $${requiredCollateral.toFixed(2)} in vault assets. You have $${availableBalance.toFixed(2)} available.`,
        },
        { status: 400 },
      );

    // Annual rate 12%, total due = principal * 1.12
    const interestRateAnnual = 12;
    const totalDue = principal * 1.12;

    // v3: loan_request — no escrow taken (admin disburses on approval)
    const { error } = await supabase.from("apex_master_requests").insert([
      {
        user_id: user.id,
        request_type: "loan_request",
        status: "pending",
        amount: principal,
        meta_data: {
          interest_rate_annual: interestRateAnnual,
          total_due: totalDue,
          investment_id: investments[0].id,
        },
      },
    ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Asset credit line requested successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
