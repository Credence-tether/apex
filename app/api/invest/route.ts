import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { plan_name, amount, apy } = await request.json();
    const allocationAmount = parseFloat(amount);

    if (isNaN(allocationAmount) || allocationAmount < 300)
      return NextResponse.json(
        { success: false, error: "Minimum allocation is $300" },
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

    // v3: insert into apex_master_requests with request_type='investment_purchase'
    // The BEFORE INSERT trigger deducts balance immediately and throws if insufficient.
    const { error } = await supabase.from("apex_master_requests").insert([
      {
        user_id: user.id,
        request_type: "investment_purchase",
        status: "pending",
        amount: allocationAmount,
        meta_data: {
          plan_name,
          apy_percentage: parseFloat(apy),
          lock_duration_weeks: 52,
          weeks_elapsed: 0,
        },
      },
    ]);

    if (error) {
      if (
        error.message?.includes("Insufficient balance") ||
        error.code === "P0001"
      )
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient available funds for this allocation",
          },
          { status: 400 },
        );
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Investment request submitted for approval.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
