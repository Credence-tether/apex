import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer a server-side secret if available; fall back to the publishable key
// for environments that haven't been configured yet. For production, set a
// service role or server key via SUPABASE_SERVICE_ROLE_KEY and never expose it
// to the browser.
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const PLACEHOLDER_URL = "https://your-project.supabase.co";
const PLACEHOLDER_KEY = "your-publishable-key";

function isPlaceholder(value?: string, placeholder?: string) {
  return (
    !value ||
    value.trim() === "" ||
    (placeholder ? value.trim() === placeholder : false)
  );
}

function getSupabaseConfig() {
  if (
    isPlaceholder(SUPABASE_URL, PLACEHOLDER_URL) ||
    isPlaceholder(SUPABASE_KEY, PLACEHOLDER_KEY)
  ) {
    throw new Error(
      "Supabase server configuration is missing or invalid. " +
        "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local.",
    );
  }

  return {
    url: SUPABASE_URL!,
    key: SUPABASE_KEY!,
  };
}

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseConfig();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Safe to ignore inside Server Components
        }
      },
    },
  });
}
