import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
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

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: name ? { name } : undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error_description ?? data.msg ?? "Unable to create account." },
      { status: response.status }
    );
  }

  return NextResponse.json(data);
}
