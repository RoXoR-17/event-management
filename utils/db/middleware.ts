import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/";
const DASHBOARD_PATH = "/home";
const ERROR_PATH = "/error";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && ![LOGIN_PATH, ERROR_PATH].includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.searchParams.set("redirect", url.pathname.slice(1));
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
