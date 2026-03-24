import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Use getSession() — reads from cookie, no network round-trip
    // This is safe for route protection in middleware
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user ?? null;

    const protectedPaths = ["/cart", "/checkout", "/orders", "/profile"];
    const adminPaths = ["/admin"];
    const authPaths = ["/login", "/register"];
    const { pathname } = request.nextUrl;

    // Redirect authenticated users away from auth pages
    if (user && authPaths.some((path) => pathname.startsWith(path))) {
      const url = request.nextUrl.clone();
      url.pathname = "/menu";
      return NextResponse.redirect(url);
    }

    // Redirect unauthenticated users to login
    if (
      !user &&
      (protectedPaths.some((path) => pathname.startsWith(path)) ||
        adminPaths.some((path) => pathname.startsWith(path)))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Check admin access — only make DB call when accessing /admin
    if (user && adminPaths.some((path) => pathname.startsWith(path))) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/menu";
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch (e) {
    // If middleware crashes for any reason, fail open so the site still loads
    console.error("Middleware error:", e);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
