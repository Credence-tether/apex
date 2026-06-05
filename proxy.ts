import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

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
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
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
  ];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith("/api/"),
  );

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── ADMIN PATH CHECK ──────────────────────────────────────
  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role") // 👈 Changed from user_role to role
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      // 👈 Changed from user_role to role
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ── LOGIN PATH REDIRECT ───────────────────────────────────
  if (user && pathname === "/login") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role") // 👈 Changed from user_role to role
      .eq("id", user.id)
      .single();

    const target = profile?.role === "admin" ? "/admin" : "/dashboard"; // 👈 Changed from user_role to role
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
