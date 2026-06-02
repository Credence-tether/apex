import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PLACEHOLDER_URL = "https://your-project.supabase.co";
const PLACEHOLDER_KEY = "your-publishable-key";

function isPlaceholder(value?: string, placeholder?: string) {
  return (
    !value ||
    value.trim() === "" ||
    (placeholder ? value.trim() === placeholder : false)
  );
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // If Supabase isn't configured, skip creating the client to avoid server errors.
  if (
    isPlaceholder(SUPABASE_URL, PLACEHOLDER_URL) ||
    isPlaceholder(SUPABASE_KEY, PLACEHOLDER_KEY)
  ) {
    console.warn(
      "Supabase proxy skipped: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY not set or left as placeholder.",
    );
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // This refreshes the session user data safely on page transitions
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
