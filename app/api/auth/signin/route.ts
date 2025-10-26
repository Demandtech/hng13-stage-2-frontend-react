import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

const ACCESS_SECRET = process.env.JWT_SECRET || "secretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  const { error: updateError } = await supabase
    .from("users")
    .update({ refresh_token: refreshToken })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to store refresh token:", updateError);
  }

  const res = NextResponse.json({
    message: "Signin successful",
    tokens: { access_token: accessToken, refresh_token: refreshToken },
  });
  return res;
}
