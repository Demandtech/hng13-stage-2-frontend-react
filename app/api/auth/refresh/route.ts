import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabaseClient";

const ACCESS_SECRET = process.env.JWT_SECRET || "secretkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export async function POST(req: Request) {
  try {
    const { refresh_token } = await req.json();

    if (!refresh_token) {
      return NextResponse.json(
        { message: "Refresh token missing" },
        { status: 400, statusText: "Bad Request" }
      );
    }

    const decoded = jwt.verify(refresh_token, REFRESH_SECRET) as { id: string };

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !user || user.refresh_token !== refresh_token) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 403, statusText: "Forbidden" }
      );
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = newRefreshToken;

    const { error: updateError } = await supabase
      .from("users")
      .update({ refresh_token: newRefreshToken })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to store refresh token:", updateError);
    }

    const res = NextResponse.json({
      message: "Token refreshed",
      tokens: {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      },
    });

    return res;
  } catch (err: any) {
    console.error("Refresh error:", err);
    return NextResponse.json(
      { message: "Invalid or expired refresh token" },
      { status: 403, statusText: "Forbidden" }
    );
  }
}
