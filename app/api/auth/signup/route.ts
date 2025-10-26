import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

const ACCESS_SECRET = process.env.JWT_SECRET || "secretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  try {
    const { email, password, confirm_password } = await req.json();

    if (!email || !password || !confirm_password)
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 422, statusText: "Unprocessable Entity" }
      );

    if (password !== confirm_password) {
      return NextResponse.json(
        { message: "Password does not match" },
        { status: 400, statusText: "Bad Request" }
      );
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser)
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409, statusText: "Conflict" }
      );

    const hashed = await bcrypt.hash(password, 10);

    const userId = crypto.randomUUID();

    const accessToken = jwt.sign({ id: userId, email: email }, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email,
        password: hashed,
        refresh_token: refreshToken,
      })
      .select()
      .single();

    if (insertError) {
      console.log(insertError);
      return NextResponse.json(
        { message: "Failed to create user", error: insertError },
        { status: 500 }
      );
    }

    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({
      message: "Signup successful",
      user: safeUser,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
