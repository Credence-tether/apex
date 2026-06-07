import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const GERMAN_COUNTRIES = ["DE", "AT", "CH"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // ── LOCALE DETECTION ─────────────────────────────────────
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "";
  const isGerman = GERMAN_COUNTRIES.includes(country.toUpperCase());
  const existingLocale = request.cookies.get("apex-locale")?.value;
  if (!existingLocale) {
    response.cookies.set("apex-locale", isGerman ? "de" : "en", {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }

  // ── SUPABASE AUTH ─────────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          // Re-apply locale cookie after response recreation
          if (!existingLocale) {
            response.cookies.set("apex-locale", isGerman ? "de" : "en", {
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
              sameSite: "lax",
            });
          }
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/",
    "/login",
    "/about",
    "/loans",
    "/fees",
    "/security",
    "/terms",
    "/auth/callback",
    "/faq",
    "/risk",
    "/privacy",
    "/contact",
  ];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith("/api/")
  );

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (user && pathname === "/login") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const target = profile?.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
