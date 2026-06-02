import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const PLACEHOLDER_URL = "https://your-project.supabase.co";
const PLACEHOLDER_KEY = "your-publishable-key";

function isPlaceholder(value?: string, placeholder?: string) {
  return (
    !value ||
    value.trim() === "" ||
    (placeholder ? value.trim() === placeholder : false)
  );
}

export function getSupabaseClientError() {
  if (
    isPlaceholder(SUPABASE_URL, PLACEHOLDER_URL) ||
    isPlaceholder(SUPABASE_KEY, PLACEHOLDER_KEY)
  ) {
    return (
      "Supabase is not configured. " +
      "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local."
    );
  }
  return undefined;
}

function createInvalidClient() {
  const error = new Error(
    "Supabase configuration is missing or invalid. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
  );

  const noOp = async () => ({ data: null, error });

  return {
    auth: {
      getUser: noOp,
      signUp: noOp,
      signInWithPassword: noOp,
      signOut: noOp,
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  } as any;
}

export function createClient() {
  if (
    isPlaceholder(SUPABASE_URL, PLACEHOLDER_URL) ||
    isPlaceholder(SUPABASE_KEY, PLACEHOLDER_KEY)
  ) {
    return createInvalidClient();
  }

  return createBrowserClient(SUPABASE_URL!, SUPABASE_KEY!);
}
