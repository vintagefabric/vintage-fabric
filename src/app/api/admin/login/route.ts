import { NextResponse } from "next/server";

/**
 * Simple password gate for /admin (plan §5/§7). Sets an httpOnly cookie when
 * the submitted password matches ADMIN_PASSWORD. This is a Stage-1 stopgap
 * until Supabase Auth is wired up.
 */
export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD is not set on the server." },
      { status: 500 },
    );
  }
  if (password !== expected) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("vf_admin", expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("vf_admin", "", { path: "/", maxAge: 0 });
  return res;
}
