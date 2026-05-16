import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accessToken, password } = await request.json();

  if (!accessToken || !password) {
    return NextResponse.json(
      { error: "Reset token and new password are required." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Supabase auth is not configured." },
      { status: 500 }
    );
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          data.error_description ??
          data.msg ??
          "Unable to update password. Please request a new reset link.",
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    message: "Password updated successfully.",
  });
}
