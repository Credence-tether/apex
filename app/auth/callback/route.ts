import { createClient } from "../../../utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  // Supabase recommends exchanging the full request URL so the library
  // can parse state and PKCE details. Pass the full URL rather than only
  // the `code` query param to ensure cookies / session tokens are set.
  try {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(request.url);
  } catch (err) {
    // Log server-side; the client will still be redirected to dashboard
    // where the app can surface an auth error message if needed.
    // eslint-disable-next-line no-console
    console.error("[auth callback] exchangeCodeForSession error:", err);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
