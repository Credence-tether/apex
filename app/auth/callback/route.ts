import { createClient } from "../../../utils/supabase/server";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "../../../emails";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  try {
    const supabase = await createClient();
    let data: any = null;
    let error: any = null;

    if (token_hash && type) {
      // Email confirmation flow (token_hash)
      const result = await supabase.auth.verifyOtp({ token_hash, type: type as any });
      data = result.data;
      error = result.error;
    } else if (code) {
      // OAuth / magic link flow (code)
      const result = await supabase.auth.exchangeCodeForSession(code);
      data = result.data;
      error = result.error;
    }

    if (!error && data?.user) {
      const user = data.user;
      const isNewUser = (Date.now() - new Date(user.created_at).getTime()) < 30000;

      if (isNewUser) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Investor";

        sendWelcomeEmail({ to: user.email!, name }).catch((err) =>
          console.error("[auth callback] welcome email failed:", err)
        );
      }
    }
  } catch (err) {
    console.error("[auth callback] error:", err);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
