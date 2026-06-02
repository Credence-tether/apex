import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { amount, wallet_address, network } = await request.json();
    const parsedAmount = parseFloat(amount);

    console.log("[POST /api/withdraw] Request received", {
      amount: parsedAmount,
      wallet_address,
      network,
    });

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.warn(
        "[POST /api/withdraw] Invalid withdrawal amount:",
        parsedAmount,
      );
      return NextResponse.json(
        { success: false, error: "Invalid withdrawal amount specified" },
        { status: 400 },
      );
    }

    if (!wallet_address || wallet_address.trim() === "") {
      console.warn("[POST /api/withdraw] Missing wallet address");
      return NextResponse.json(
        { success: false, error: "Destination wallet address is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[POST /api/withdraw] Unauthorized access attempt");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Verify user has sufficient balance
    const { data: wallet, error: walletErr } = await supabase
      .from("apex_wallets")
      .select("available_balance")
      .eq("user_id", user.id)
      .single();

    if (
      walletErr ||
      !wallet ||
      Number(wallet.available_balance) < parsedAmount
    ) {
      console.warn(
        "[POST /api/withdraw] Insufficient funds for user:",
        user.id,
        "Available:",
        wallet?.available_balance,
        "Requested:",
        parsedAmount,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient available balance for withdrawal",
        },
        { status: 400 },
      );
    }

    // Deduct from balance
    await supabase
      .from("apex_wallets")
      .update({
        available_balance: Number(wallet.available_balance) - parsedAmount,
      })
      .eq("user_id", user.id);

    // Log withdrawal
    const { error: withdrawErr } = await supabase
      .from("apex_withdrawals")
      .insert([
        {
          user_id: user.id,
          amount: parsedAmount,
          wallet_address: wallet_address.trim(),
          network: network || "ERC20",
          status: "pending",
        },
      ]);

    if (withdrawErr) {
      console.error(
        "[POST /api/withdraw] Failed to record withdrawal:",
        withdrawErr,
      );
      throw withdrawErr;
    }

    console.log(
      "[POST /api/withdraw] Success for user:",
      user.id,
      "Amount:",
      parsedAmount,
    );
    return NextResponse.json(
      {
        success: true,
        message: "Withdrawal transaction logged and processed.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[POST /api/withdraw] Server error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
