import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid currency amount" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Access unauthorized" },
        { status: 401 },
      );
    }

    // Direct, validated insert utilizing secure user server reference
    const { error } = await supabase
      .from("apex_deposit_requests")
      .insert([{ user_id: user.id, amount: parsedAmount, status: "pending" }]);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Deposit recorded for admin review" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
