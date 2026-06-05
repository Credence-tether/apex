import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { amount, wallet_address, network } = await request.json();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0)
      return NextResponse.json(
        { success: false, error: "Invalid withdrawal amount specified" },
        { status: 400 },
      );
    if (!wallet_address || wallet_address.trim() === "")
      return NextResponse.json(
        { success: false, error: "Destination wallet address is required" },
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

    // v3: insert into apex_master_requests with request_type='withdrawal'
    // The BEFORE INSERT trigger (handle_request_escrow) automatically deducts
    // the balance and throws 'Insufficient balance' if funds are short.
    const { error } = await supabase.from("apex_master_requests").insert([
      {
        user_id: user.id,
        request_type: "withdrawal",
        status: "pending",
        amount: parsedAmount,
        meta_data: {
          wallet_address: wallet_address.trim(),
          network: network || "ERC20",
        },
      },
    ]);

    if (error) {
      // Surface the trigger's human-readable error
      if (
        error.message?.includes("Insufficient balance") ||
        error.code === "P0001"
      )
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient available balance for withdrawal",
          },
          { status: 400 },
        );
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted and pending review.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
