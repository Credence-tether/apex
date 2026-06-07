import { createClient } from "../../../utils/supabase/server";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/emails";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(request.url);

    if (!error && data?.user) {
      const user = data.user;
      const isNewUser = user.created_at === user.updated_at ||
        (Date.now() - new Date(user.created_at).getTime()) < 30000;

      if (isNewUser) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Investor";

        // Fire and forget — never block the redirect
        sendWelcomeEmail({ to: user.email!, name }).catch((err) =>
          console.error("[auth callback] welcome email failed:", err)
        );
      }
    }
  } catch (err) {
    console.error("[auth callback] exchangeCodeForSession error:", err);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
